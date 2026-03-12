document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studentNameInput = document.getElementById('studentName');
    const studentScoreInput = document.getElementById('studentScore');
    const addBtn = document.getElementById('addBtn');
    const studentList = document.getElementById('studentList');
    const statisticsDiv = document.getElementById('statistics');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const scoreHeader = document.getElementById('scoreHeader');
    const noResults = document.getElementById('noResults');

    // Data
    let students = [];
    let sortState = {
        column: 'score',
        direction: 'none' // 'asc', 'desc', 'none'
    };

    // --- Helper Functions ---
    const getGrade = (score) => {
        if (score >= 8.5) return 'Giỏi';
        if (score >= 7.0) return 'Khá';
        if (score >= 5.0) return 'Trung bình';
        return 'Yếu';
    };

    const calculateStats = (studentArray) => {
        const totalStudents = studentArray.length;
        if (totalStudents === 0) {
            statisticsDiv.innerHTML = 'Tổng số sinh viên: 0 | Điểm trung bình: N/A';
            return;
        }
        const totalScore = studentArray.reduce((sum, student) => sum + student.score, 0);
        const averageScore = (totalScore / totalStudents).toFixed(2);
        statisticsDiv.innerHTML = `Tổng số sinh viên: ${totalStudents} | Điểm trung bình: ${averageScore}`;
    };

    const renderTable = (studentArray) => {
        studentList.innerHTML = '';
        noResults.classList.toggle('hidden', studentArray.length > 0);

        studentArray.forEach((student, index) => {
            const grade = getGrade(student.score);
            const row = document.createElement('tr');
            if (student.score < 5.0) {
                row.classList.add('row-weak');
            }
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.score}</td>
                <td>${grade}</td>
                <td><button class="delete-btn" data-index="${student.id}">Xóa</button></td>
            `;
            studentList.appendChild(row);
        });
        calculateStats(studentArray);
    };

    const applyFiltersAndSort = () => {
        let filteredStudents = [...students];

        // 1. Search
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredStudents = filteredStudents.filter(student =>
                student.name.toLowerCase().includes(searchTerm)
            );
        }

        // 2. Filter by grade
        const filterValue = filterSelect.value;
        if (filterValue !== 'all') {
            filteredStudents = filteredStudents.filter(student => getGrade(student.score) === filterValue);
        }

        // 3. Sort
        if (sortState.direction !== 'none') {
            filteredStudents.sort((a, b) => {
                if (sortState.direction === 'asc') {
                    return a.score - b.score;
                } else {
                    return b.score - a.score;
                }
            });
        }

        renderTable(filteredStudents);
    };

    const updateSortIndicator = () => {
        const indicator = scoreHeader.querySelector('span');
        if (sortState.direction === 'asc') {
            indicator.textContent = '▲';
        } else if (sortState.direction === 'desc') {
            indicator.textContent = '▼';
        } else {
            indicator.textContent = '';
        }
    };

    // --- Event Handlers ---
    const handleAddStudent = () => {
        const name = studentNameInput.value.trim();
        const score = parseFloat(studentScoreInput.value);

        if (!name) {
            alert('Vui lòng nhập họ tên sinh viên.');
            return;
        }
        if (isNaN(score) || score < 0 || score > 10) {
            alert('Điểm phải là một số từ 0 đến 10.');
            return;
        }

        students.push({ id: Date.now(), name, score });

        // Reset inputs
        studentNameInput.value = '';
        studentScoreInput.value = '';
        studentNameInput.focus();

        applyFiltersAndSort();
    };

    const handleDeleteStudent = (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const studentId = parseInt(e.target.dataset.index);
            students = students.filter(student => student.id !== studentId);
            applyFiltersAndSort();
        }
    };

    const handleSort = () => {
        if (sortState.direction === 'none' || sortState.direction === 'desc') {
            sortState.direction = 'asc';
        } else {
            sortState.direction = 'desc';
        }
        updateSortIndicator();
        applyFiltersAndSort();
    };

    // --- Event Listeners ---
    addBtn.addEventListener('click', handleAddStudent);

    studentScoreInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleAddStudent();
        }
    });

    // Event Delegation for delete buttons
    studentList.addEventListener('click', handleDeleteStudent);

    searchInput.addEventListener('input', applyFiltersAndSort);
    filterSelect.addEventListener('change', applyFiltersAndSort);
    scoreHeader.addEventListener('click', handleSort);

    // Initial Render
    applyFiltersAndSort();
});