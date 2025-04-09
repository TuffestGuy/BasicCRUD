let tasks = [];


async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    tasks = await response.json();
    renderTasks();
}


function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline ? new Date(task.deadline).toLocaleString() : 'No Deadline'}</td>
            <td class="action-buttons">
                <button onclick="editTask(${task.id})" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="editDescription(${task.id})" class="edit-desc-btn">
                    <i class="fas fa-pencil-alt"></i> Update Status
                </button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        taskList.appendChild(row);
    });
}


async function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const descriptionInput = document.getElementById('descriptionInput').value.trim();
    const deadlineInput = document.getElementById('deadlineInput').value.trim();

    if (taskInput) {
        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskInput, description: descriptionInput, deadline: deadlineInput })
        });

        document.getElementById('taskInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('deadlineInput').value = '';

        fetchTasks();
    }
}


async function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt('Edit task:', task.title);
    if (newTitle !== null && newTitle.trim() !== '') {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, title: newTitle.trim() })
        });
        fetchTasks();
    }
}


async function editDescription(id) {
    const task = tasks.find(t => t.id === id);
    const newDescription = prompt('Update task status/description:', task.description);
    if (newDescription !== null) {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, description: newDescription.trim() })
        });
        fetchTasks();
    }
}


async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}


document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') document.getElementById('descriptionInput').focus();
});

document.getElementById('descriptionInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') document.getElementById('deadlineInput').focus();
});

document.getElementById('deadlineInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

// Load tasks initially
fetchTasks();
