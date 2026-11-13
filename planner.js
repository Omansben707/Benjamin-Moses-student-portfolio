// Academic planner: array-based task management persisted in localStorage.
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "benjaminMosesAcademicTasks";
  const form = document.getElementById("taskForm");
  const titleInput = document.getElementById("taskTitle");
  const categoryInput = document.getElementById("taskCategory");
  const dueInput = document.getElementById("taskDue");
  const taskList = document.getElementById("taskList");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  let tasks = loadTasks();
  let activeFilter = "all";

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  }
  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch { alert("Your browser could not save the tasks. Check your storage settings."); }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  }
  function formatDate(date) {
    if (!date) return "No due date";
    return new Date(date + "T00:00:00").toLocaleDateString(undefined, {day:"numeric",month:"short",year:"numeric"});
  }
  function render() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const remaining = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("remainingCount").textContent = remaining;
    document.getElementById("progressPercent").textContent = percent + "%";
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("taskCountPill").textContent = `${total} ${total === 1 ? "task" : "tasks"}`;
    const shown = tasks.filter(task => activeFilter === "all" ||
      (activeFilter === "active" && !task.completed) ||
      (activeFilter === "completed" && task.completed));
    if (!shown.length) {
      taskList.innerHTML = `<div class="empty-state">${total ? "No tasks in this filter." : "No tasks yet. Add your first task above."}</div>`;
      return;
    }
    taskList.innerHTML = shown.map(task => `
      <article class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
        <input class="task-check" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} as completed" ${task.completed ? "checked" : ""}>
        <div class="task-detail"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.category)} · ${formatDate(task.dueDate)}</small></div>
        <span class="category-pill">${escapeHTML(task.category)}</span>
        <button class="delete-task" type="button" aria-label="Delete task">×</button>
      </article>`).join("");
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) { titleInput.focus(); return; }
    tasks.unshift({id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()), title, category: categoryInput.value, dueDate: dueInput.value, completed: false});
    saveTasks(); render(); form.reset(); titleInput.focus();
  });
  taskList.addEventListener("change", event => {
    if (!event.target.classList.contains("task-check")) return;
    const id = event.target.closest(".task-item").dataset.id;
    tasks = tasks.map(task => task.id === id ? {...task, completed: event.target.checked} : task);
    saveTasks(); render();
  });
  taskList.addEventListener("click", event => {
    if (!event.target.classList.contains("delete-task")) return;
    const id = event.target.closest(".task-item").dataset.id;
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(); render();
  });
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    render();
  }));
  document.getElementById("clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks(); render();
  });
  const today = new Date();
  document.getElementById("todayLabel").textContent = today.toLocaleDateString(undefined, {weekday:"short",day:"numeric",month:"long",year:"numeric"});
  render();
});