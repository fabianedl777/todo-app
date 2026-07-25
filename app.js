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

function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return [...tasks];
}

function countActive(tasks) {
  return tasks.filter(t => !t.completed).length;
}

function clearCompleted(tasks) {
  return tasks.filter(t => !t.completed);
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

function saveFilter(filter) {
  try {
    localStorage.setItem('filter', filter);
  } catch (e) {
    // Swallow: app continues with in-memory filter
  }
}

function loadFilter() {
  try {
    const filter = localStorage.getItem('filter');
    if (filter === 'all' || filter === 'active' || filter === 'completed') {
      return filter;
    }
    return 'all';
  } catch (e) {
    return 'all';
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
    filterTasks,
    countActive,
    clearCompleted,
    saveTasks,
    loadTasks,
    saveFilter,
    loadFilter,
  };
}

// ============================================================
// SECTION 3: DOM Layer — event wiring and rendering
// ============================================================

let tasks = [];
let currentFilter = 'all';

function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';

  const visible = filterTasks(tasks, currentFilter);

  for (const task of visible) {
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

  updateTaskCount(tasks);

  const hasCompleted = tasks.some(t => t.completed);
  const clearBtn = document.querySelector('.clear-completed');
  if (clearBtn) clearBtn.style.display = hasCompleted ? '' : 'none';
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

function handleClearCompleted() {
  tasks = clearCompleted(tasks);
  saveTasks(tasks);
  render(tasks);
}

function updateFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.dataset.filter === currentFilter);
  });
}

function updateTaskCount(tasks) {
  const count = countActive(tasks);
  const el = document.querySelector('.task-count');
  if (el) el.textContent = count + (count === 1 ? ' item left' : ' items left');
}

function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  saveFilter(currentFilter);
  updateFilterButtons();
  render(tasks);
}

function init() {
  tasks = loadTasks();
  currentFilter = loadFilter();
  updateFilterButtons();
  render(tasks);

  document.getElementById('new-task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  document.getElementById('todo-list').addEventListener('click', handleListClick);
  document.getElementById('todo-list').addEventListener('dblclick', handleListDblClick);
  document.querySelector('.filters').addEventListener('click', handleFilterClick);
  document.querySelector('.clear-completed').addEventListener('click', handleClearCompleted);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}