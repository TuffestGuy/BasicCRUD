document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskTable = document.getElementById("tasks");

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();

    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;
        
        const task = { id: Date.now(), text: taskText };
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
        taskInput.value = "";
        renderTasks();
    });

    function renderTasks() {
        taskTable.innerHTML = "";
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.text}</td>
                <td>
                    <button class="edit" data-id="${task.id}">Edit</button>
                    <button class="delete" data-id="${task.id}">Delete</button>
                </td>
            `;
            taskTable.appendChild(row);
        });

        document.querySelectorAll(".edit").forEach(button => {
            button.addEventListener("click", (e) => editTask(e.target.dataset.id));
        });

        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", (e) => deleteTask(e.target.dataset.id));
        });
    }

    function editTask(id) {
        const task = tasks.find(t => t.id == id);
        const newText = prompt("Edit task:", task.text);
        if (newText !== null) {
            task.text = newText;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    }

    function deleteTask(id) {
        const index = tasks.findIndex(t => t.id == id);
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
});