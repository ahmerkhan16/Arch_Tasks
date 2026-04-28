let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCount() {
    const activeCount = tasks.filter(t => !t.completed).length;
    document.getElementById("task-count").textContent =
        `${activeCount} task${activeCount === 1 ? "" : "s"} left`;
}

function renderTasks() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <label class="checkbox-label">
                <input type="checkbox" class="peer" ${task.completed ? "checked" : ""}>
                <span class="checkbox-visual"></span>
            </label>
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="action-btn edit-btn">✏️</button>
                <button class="action-btn delete-btn">🗑️</button>
            </div>
        `;

        li.querySelector(".peer").addEventListener("change", () => toggleTask(task.id));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));
        li.querySelector(".edit-btn").addEventListener("click", () => startInlineEdit(task.id, li));

        list.appendChild(li);
    });

    updateCount();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function addTask() {
    const input = document.getElementById("task-input");
    const value = input.value.trim();

    if (!value) return;

    tasks.unshift({
        id: generateId(),
        text: value,
        completed: false
    });

    saveTasks();
    input.value = "";
    renderTasks();
}

function startInlineEdit(id, li) {
    const task = tasks.find(t => t.id === id);
    const textSpan = li.querySelector(".task-text");

    const input = document.createElement("input");
    input.value = task.text;

    textSpan.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        task.text = input.value;
        saveTasks();
        renderTasks();
    });
}

function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

function init() {
    const form = document.getElementById("add-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTask();
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => setFilter(btn.dataset.filter));
    });

    document.getElementById("clear-btn").addEventListener("click", clearCompleted);

    renderTasks();
}

window.onload = init;