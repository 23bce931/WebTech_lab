document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const alert = document.getElementById('alert');
    const studentsBody = document.getElementById('studentsBody');
    const studentsTable = document.getElementById('studentsTable');
    const noStudentsEl = document.getElementById('noStudents');
    const loadingEl = document.getElementById('loading');
    const totalStudentsEl = document.getElementById('totalStudents');
    const avgMarksEl = document.getElementById('avgMarks');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    let students = [];
    let editingId = null;

    // Load students on page load
    loadStudents();

    // Event listeners
    form.addEventListener('submit', handleFormSubmit);
    refreshBtn.addEventListener('click', loadStudents);
    cancelBtn.addEventListener('click', resetForm);

    function showAlert(message, type = 'success') {
        alert.textContent = message;
        alert.className = `alert ${type} show`;
        setTimeout(() => alert.classList.remove('show'), 4000);
    }

    function resetForm() {
        form.reset();
        submitBtn.textContent = 'Add Student';
        cancelBtn.classList.add('hidden');
        document.getElementById('formTitle').textContent = 'Add New Student';
        editingId = null;
    }

    function showLoading() {
        loadingEl.classList.remove('hidden');
        studentsTable.classList.add('hidden');
        noStudentsEl.classList.add('hidden');
    }

    function hideLoading() {
        loadingEl.classList.add('hidden');
    }

    async function loadStudents() {
        showLoading();

        try {
            const response = await fetch('students.json');
            if (!response.ok) throw new Error('Failed to fetch students.json');

            students = await response.json();
            
            // Validate JSON structure
            if (!Array.isArray(students)) {
                throw new Error('Invalid JSON format - expected array');
            }

            displayStudents();
        } catch (error) {
            console.error('Load error:', error);
            showAlert(`❌ Error loading students: ${error.message}`, 'error');
            noStudentsEl.classList.remove('hidden');
        } finally {
            hideLoading();
        }
    }

    function displayStudents() {
        studentsBody.innerHTML = '';
        
        if (students.length === 0) {
            noStudentsEl.classList.remove('hidden');
            totalStudentsEl.textContent = '0';
            avgMarksEl.textContent = '-';
            return;
        }

        noStudentsEl.classList.add('hidden');
        studentsTable.classList.remove('hidden');

        let totalMarks = 0;
        students.forEach(student => {
            totalMarks += student.marks;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.marks}</td>
                <td><span class="grade-${getGrade(student.marks)}">${getGrade(student.marks)}</span></td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            `;
            studentsBody.appendChild(row);
        });

        // Update stats
        totalStudentsEl.textContent = students.length;
        avgMarksEl.textContent = Math.round(totalMarks / students.length);
    }

    function getGrade(marks) {
        if (marks >= 90) return 'A';
        if (marks >= 80) return 'B';
        if (marks >= 70) return 'C';
        return 'F';
    }

    function validateStudent(id, name, course, marks) {
        // ID format: S001
        if (!/^S\d{3}$/.test(id)) return 'ID must be S001 format';
        if (name.length < 2) return 'Name too short';
        if (course.length < 2) return 'Course too short';
        if (marks < 0 || marks > 100) return 'Marks must be 0-100';
        
        // Check duplicate ID
        if (!editingId && students.find(s => s.id === id)) {
            return 'ID already exists';
        }
        return null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const id = document.getElementById('studentId').value.trim();
        const name = document.getElementById('studentName').value.trim();
        const course = document.getElementById('studentCourse').value.trim();
        const marks = parseInt(document.getElementById('studentMarks').value);

        const validationError = validateStudent(id, name, course, marks);
        if (validationError) {
            showAlert(`❌ ${validationError}`, 'error');
            return;
        }

        const studentData = { id, name, course, marks };

        if (editingId) {
            await updateStudent(editingId, studentData);
        } else {
            await createStudent(studentData);
        }
    }

    async function createStudent(student) {
        try {
            students.push(student);
            showAlert('✅ Student added successfully!');
            resetForm();
            displayStudents();
        } catch (error) {
            showAlert('❌ Failed to add student', 'error');
        }
    }

    async function updateStudent(oldId, student) {
        try {
            const index = students.findIndex(s => s.id === oldId);
            if (index !== -1) {
                students[index] = student;
                showAlert('✅ Student updated successfully!');
                resetForm();
                displayStudents();
            }
        } catch (error) {
            showAlert('❌ Failed to update student', 'error');
        }
    }

    function deleteStudent(id) {
        if (confirm('Delete this student?')) {
            try {
                students = students.filter(s => s.id !== id);
                showAlert('🗑️ Student deleted successfully!');
                displayStudents();
            } catch (error) {
                showAlert('❌ Failed to delete student', 'error');
            }
        }
    }

    function editStudent(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentCourse').value = student.course;
            document.getElementById('studentMarks').value = student.marks;
            
            submitBtn.textContent = 'Update Student';
            cancelBtn.classList.remove('hidden');
            document.getElementById('formTitle').textContent = 'Edit Student';
            editingId = id;
        }
    }

    // Global functions for onclick
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;
});
