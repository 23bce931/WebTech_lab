document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeForm');
    const notification = document.getElementById('notification');
    const employeeGrid = document.getElementById('employeeGrid');
    const countEl = document.getElementById('count');
    const loadingEl = document.getElementById('loading');
    const noDataEl = document.getElementById('noData');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let editingId = null;
    let xmlDoc = null;

    // Load XML on page load
    loadEmployees();

    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    function showNotification(text, type = 'success') {
        notification.textContent = text;
        notification.className = `notification ${type} show`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    function resetForm() {
        form.reset();
        submitBtn.textContent = 'Add Employee';
        cancelBtn.classList.add('hidden');
        editingId = null;
    }

    async function loadEmployees() {
        loadingEl.classList.remove('hidden');
        employeeGrid.classList.add('hidden');
        noDataEl.classList.add('hidden');

        try {
            const response = await fetch('employees.xml');
            if (!response.ok) throw new Error('XML file missing');
            
            const xmlText = await response.text();
            const parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const errorNode = xmlDoc.querySelector('parsererror');
            if (errorNode) throw new Error('Invalid XML format');

            displayEmployees();
        } catch (error) {
            console.error('XML Load Error:', error);
            showNotification('❌ Error loading XML: ' + error.message, 'error');
            noDataEl.classList.remove('hidden');
        } finally {
            loadingEl.classList.add('hidden');
        }
    }

    function displayEmployees() {
        const employees = xmlDoc.getElementsByTagName('employee');
        employeeGrid.innerHTML = '';
        countEl.textContent = employees.length;

        if (employees.length === 0) {
            noDataEl.classList.remove('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        employeeGrid.classList.remove('hidden');

        Array.from(employees).forEach(emp => {
            const id = emp.getElementsByTagName('id')[0].textContent;
            const name = emp.getElementsByTagName('name')[0].textContent;
            const dept = emp.getElementsByTagName('department')[0].textContent;
            const salary = emp.getElementsByTagName('salary')[0].textContent;

            const card = document.createElement('div');
            card.className = 'employee-card';
            card.innerHTML = `
                <div class="employee-id">🆔 ${id}</div>
                <div class="employee-name">${name}</div>
                <div class="employee-details">
                    <div class="detail-row">
                        <span>Department:</span>
                        <strong>${dept}</strong>
                    </div>
                    <div class="detail-row">
                        <span>Salary:</span>
                        <strong>₹${parseInt(salary).toLocaleString()}</strong>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editEmployee('${id}')">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteEmployee('${id}')">Delete</button>
                </div>
            `;
            employeeGrid.appendChild(card);
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('id').value.trim();
        const name = document.getElementById('name').value.trim();
        const department = document.getElementById('department').value.trim();
        const salary = document.getElementById('salary').value;

        console.log('Form data:', { id, name, department, salary, editingId }); // DEBUG

        if (editingId) {
            updateEmployee(editingId, { id, name, department, salary });
        } else {
            createEmployee({ id, name, department, salary });
        }
    }

    function createEmployee(data) {
        try {
            // ✅ FIXED: Proper XML node creation
            const newEmployee = xmlDoc.createElement('employee');
            const idNode = xmlDoc.createElement('id');
            idNode.textContent = data.id;
            const nameNode = xmlDoc.createElement('name');
            nameNode.textContent = data.name;
            const deptNode = xmlDoc.createElement('department');
            deptNode.textContent = data.department;
            const salaryNode = xmlDoc.createElement('salary');
            salaryNode.textContent = data.salary;

            newEmployee.appendChild(idNode);
            newEmployee.appendChild(nameNode);
            newEmployee.appendChild(deptNode);
            newEmployee.appendChild(salaryNode);

            const employeesNode = xmlDoc.getElementsByTagName('employees')[0];
            employeesNode.appendChild(newEmployee);

            showNotification('✅ Employee added successfully!');
            displayEmployees();
            resetForm();
        } catch (error) {
            console.error('Create error:', error);
            showNotification('❌ Error adding employee', 'error');
        }
    }

    function updateEmployee(originalId, data) {
        try {
            const employees = xmlDoc.getElementsByTagName('employee');
            for (let i = 0; i < employees.length; i++) {
                const empIdNode = employees[i].getElementsByTagName('id')[0];
                if (empIdNode.textContent === originalId) {
                    // Update all fields
                    empIdNode.textContent = data.id;
                    employees[i].getElementsByTagName('name')[0].textContent = data.name;
                    employees[i].getElementsByTagName('department')[0].textContent = data.department;
                    employees[i].getElementsByTagName('salary')[0].textContent = data.salary;
                    
                    showNotification('✅ Employee updated successfully!');
                    displayEmployees();
                    resetForm();
                    return;
                }
            }
            showNotification('❌ Employee not found', 'error');
        } catch (error) {
            console.error('Update error:', error);
            showNotification('❌ Error updating employee', 'error');
        }
    }

    function deleteEmployee(id) {
        if (confirm('Delete this employee?')) {
            try {
                const employees = xmlDoc.getElementsByTagName('employee');
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].getElementsByTagName('id')[0].textContent === id) {
                        employees[i].parentNode.removeChild(employees[i]);
                        showNotification('🗑️ Employee deleted successfully!');
                        displayEmployees();
                        return;
                    }
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    }

    function editEmployee(id) {
        try {
            const employees = xmlDoc.getElementsByTagName('employee');
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].getElementsByTagName('id')[0].textContent === id) {
                    const emp = employees[i];
                    document.getElementById('id').value = emp.getElementsByTagName('id')[0].textContent;
                    document.getElementById('name').value = emp.getElementsByTagName('name')[0].textContent;
                    document.getElementById('department').value = emp.getElementsByTagName('department')[0].textContent;
                    document.getElementById('salary').value = emp.getElementsByTagName('salary')[0].textContent;
                    
                    submitBtn.textContent = 'Update Employee';
                    cancelBtn.classList.remove('hidden');
                    editingId = id; // Store original ID for update
                    return;
                }
            }
        } catch (error) {
            console.error('Edit error:', error);
        }
    }

    // Global functions for onclick
    window.editEmployee = editEmployee;
    window.deleteEmployee = deleteEmployee;
});
