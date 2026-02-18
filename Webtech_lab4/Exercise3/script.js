document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const message = document.getElementById('message');
    const studentsBody = document.getElementById('studentsBody');
    const studentsCount = document.getElementById('studentsCount');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const idField = document.getElementById('id');

    let editingId = null;

    // Load students on page load
    loadStudents();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentData = {
            id: idField.value || generateId(),
            name: document.getElementById('name').value.trim(),
            department: document.getElementById('department').value.trim(),
            marks: parseInt(document.getElementById('marks').value)
        };

        console.log('Saving:', studentData); // DEBUG - check F12 console

        if (editingId) {
            updateStudent(editingId, studentData);
        } else {
            createStudent(studentData);
        }
    });

    cancelBtn.addEventListener('click', resetForm);

    function generateId() {
        return 'S' + Date.now().toString().slice(-6);
    }

    function showMessage(text, type = 'success') {
        message.textContent = text;
        message.className = `message ${type}`;
        message.classList.remove('hidden');
        setTimeout(() => message.classList.add('hidden'), 3000);
    }

    function resetForm() {
        form.reset();
        idField.value = '';
        idField.removeAttribute('readonly');
        idField.style.background = '#fff';
        submitBtn.textContent = 'Add Student';
        cancelBtn.classList.add('hidden');
        editingId = null;
    }

    function loadStudents() {
        const students = JSON.parse(localStorage.getItem('students')) || [
            {id: "S1001", name: "John Doe", department: "Computer Science", marks: 85},
            {id: "S1002", name: "Jane Smith", department: "Mathematics", marks: 92},
            {id: "S1003", name: "Mike Johnson", department: "Physics", marks: 78}
        ];
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents(students);
    }

    function createStudent(student) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        showMessage('✅ Student added successfully!');
        displayStudents(students);
        resetForm();
    }

    function updateStudent(id, student) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = student;
            localStorage.setItem('students', JSON.stringify(students));
            showMessage('✅ Student updated successfully!');
            displayStudents(students);
            resetForm();
        }
    }

    function deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            let students = JSON.parse(localStorage.getItem('students')) || [];
            students = students.filter(s => s.id !== id);
            localStorage.setItem('students', JSON.stringify(students));
            showMessage('🗑️ Student deleted successfully!');
            displayStudents(students);
        }
    }

    function displayStudents(students) {
        studentsBody.innerHTML = '';
        studentsCount.textContent = students.length;

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td>${student.department}</td>
                <td><strong>${student.marks}</strong></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            `;
            studentsBody.appendChild(row);
        });
    }

    // Make functions global
    window.editStudent = function(id) {
        console.log('Edit clicked for ID:', id);
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students.find(s => s.id === id);
        
        if (student) {
            idField.value = student.id;
            document.getElementById('name').value = student.name;
            document.getElementById('department').value = student.department;
            document.getElementById('marks').value = student.marks;
            
            idField.setAttribute('readonly', true);
            idField.style.background = '#f8f9fa';
            
            submitBtn.textContent = 'Update Student';
            cancelBtn.classList.remove('hidden');
            editingId = id;
            
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deleteStudent = deleteStudent;
});
