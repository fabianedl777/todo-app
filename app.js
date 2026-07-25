// ============================================================
// SECTION 1: Pure Functions — Task CRUD logic (no side effects)
// ============================================================

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createTask(tasks, text) {
  if (typeof text !== 'string') return tasks;
  const trimmed = text.trim();
  if (trimmed === '') return tasks;
  return [{
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  }, ...tasks];
}

function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}

function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}

function editTask(tasks, id, newText) {
  if (typeof newText !== 'string') return tasks.map(t => t);
  const trimmed = newText.trim();
  return tasks.map(t => {
    if (t.id !== id) return t;
    if (trimmed === '') return t;
    return { ...t, text: trimmed };
  });
}

// ============================================================
// SECTION 2: Storage Module — localStorage persistence
// ============================================================

function saveTasks(tasks) {
  try {
    localStorage.setItem('todos', JSON.stringify(tasks));
  } catch (e) {
    // Swallow: app continues in-memory
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem('todos');
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

// ============================================================
// Cross-Environment Export Guard
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTask,
    toggleTask,
    deleteTask,
    editTask,
    saveTasks,
    loadTasks,
  };
}

// ============================================================
// SECTION 3: DOM Layer — event wiring and rendering
// ============================================================

let tasks = [];

function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = task.completed ? 'todo-item todo-item--completed' : 'todo-item';
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo__delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';

    li.append(checkbox, span, deleteBtn);
    ul.appendChild(li);
  }
}

function handleCreate() {
  const input = document.getElementById('new-task-input');
  const text = input.value.trim();
  if (text === '') return;
  tasks = createTask(tasks, text);
  input.value = '';
  saveTasks(tasks);
  render(tasks);
}

function handleListClick(e) {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('todo__checkbox')) {
    tasks = toggleTask(tasks, id);
    saveTasks(tasks);
    render(tasks);
  } else if (e.target.classList.contains('todo__delete')) {
    tasks = deleteTask(tasks, id);
    saveTasks(tasks);
    render(tasks);
  }
}

function handleListDblClick(e) {
  if (!e.target.classList.contains('todo__text')) return;
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = li.dataset.id;
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  enterEditMode(li, task);
}

function enterEditMode(li, task) {
  const span = li.querySelector('.todo__text');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo__edit-input';
  input.value = task.text;
  input.dataset.original = task.text;
  span.replaceWith(input);
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(li, task, input);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit(li, task);
    }
  });

  input.addEventListener('blur', () => {
    commitEdit(li, task, input);
  });
}

function commitEdit(li, task, input) {
  if (input.dataset.committed) return;
  input.dataset.committed = 'true';

  const newText = input.value.trim();
  if (newText === '') {
    cancelEdit(li, task);
    return;
  }
  tasks = editTask(tasks, task.id, newText);
  saveTasks(tasks);
  render(tasks);
}

function cancelEdit(li, task) {
  render(tasks);
}

function init() {
  tasks = loadTasks();
  render(tasks);

  document.getElementById('new-task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  document.getElementById('todo-list').addEventListener('click', handleListClick);
  document.getElementById('todo-list').addEventListener('dblclick', handleListDblClick);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}