// ============================================================
// SECTION 1: Pure Functions — Task CRUD logic (no side effects)
// Functions: generateId, createTask, toggleTask, deleteTask, editTask,
//            filterTasks, countActive, clearCompleted, setPriority
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
    priority: 'medium',
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

function setPriority(tasks, id, priority) {
  if (!['high', 'medium', 'low'].includes(priority)) return tasks.map(t => t);
  return tasks.map(t => t.id === id ? { ...t, priority } : t);
}

function filterByPriority(tasks, priority) {
  if (priority === 'all') return [...tasks];
  return tasks.filter(t => (t.priority || 'medium') === priority);
}

function formatRelativeTime(isoString) {
  const then = new Date(isoString).getTime();
  if (isNaN(then)) return 'unknown';
  const diff = Math.floor((Date.now() - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function importTasks(existing, imported) {
  if (!Array.isArray(imported)) return [...existing];
  const existingIds = new Set(existing.map(t => t.id));
  const newTasks = imported.filter(t => t && t.id && !existingIds.has(t.id) && typeof t.text === 'string');
  return [...newTasks, ...existing];
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

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // Swallow: app continues with in-memory theme
  }
}

function loadTheme() {
  try {
    const t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') return t;
    return 'light';
  } catch (e) {
    return 'light';
  }
}

function savePriorityFilter(filter) {
  try {
    localStorage.setItem('priorityFilter', filter);
  } catch (e) {
    // Swallow
  }
}

function loadPriorityFilter() {
  try {
    const f = localStorage.getItem('priorityFilter');
    if (f === 'all' || f === 'high' || f === 'medium' || f === 'low') return f;
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
    setPriority,
    filterByPriority,
    formatRelativeTime,
    importTasks,
    saveTasks,
    loadTasks,
    saveFilter,
    loadFilter,
    saveTheme,
    loadTheme,
    savePriorityFilter,
    loadPriorityFilter,
  };
}

// ============================================================
// SECTION 3: DOM Layer — event wiring and rendering
// ============================================================

let tasks = [];
let currentFilter = 'all';
let currentTheme = 'light';
let currentPriorityFilter = 'all';

function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';

  let visible = filterTasks(tasks, currentFilter);
  visible = filterByPriority(visible, currentPriorityFilter);

  for (const task of visible) {
    const li = document.createElement('li');
    li.className = task.completed ? 'todo-item todo-item--completed' : 'todo-item';
    li.dataset.id = task.id;

    const priorityDot = document.createElement('span');
    priorityDot.className = 'todo__priority todo__priority--' + (task.priority || 'medium');
    priorityDot.textContent = '●';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = task.text;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'todo__date';
    dateSpan.textContent = formatRelativeTime(task.createdAt);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo__delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';

    li.append(priorityDot, checkbox, span, dateSpan, deleteBtn);
    ul.appendChild(li);
  }

  if (visible.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = getEmptyMessage();
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
    li.classList.add('todo-item--removing');
    setTimeout(() => {
      tasks = deleteTask(tasks, id);
      saveTasks(tasks);
      render(tasks);
    }, 200);
  } else if (e.target.classList.contains('todo__priority')) {
    const current = tasks.find(t => t.id === id);
    if (!current) return;
    const order = ['medium', 'high', 'low'];
    const nextIdx = (order.indexOf(current.priority || 'medium') + 1) % 3;
    tasks = setPriority(tasks, id, order[nextIdx]);
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

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function handleThemeToggle() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  saveTheme(currentTheme);
  applyTheme(currentTheme);
}

function getEmptyMessage() {
  if (tasks.length === 0) return 'No tasks yet. Add one above!';
  if (currentFilter === 'active') return 'No active tasks. Nice work!';
  if (currentFilter === 'completed') return 'No completed tasks yet.';
  return 'Nothing to show.';
}

function updateTaskCount(tasks) {
  const count = countActive(tasks);
  const el = document.querySelector('.task-count');
  if (el) el.textContent = count + (count === 1 ? ' item left' : ' items left');
}

function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn || !btn.dataset.filter) return;
  currentFilter = btn.dataset.filter;
  saveFilter(currentFilter);
  updateFilterButtons();
  render(tasks);
}

function updatePriorityFilterButtons() {
  const buttons = document.querySelectorAll('[data-priority-filter]');
  buttons.forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.dataset.priorityFilter === currentPriorityFilter);
  });
}

function handlePriorityFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn || !btn.dataset.priorityFilter) return;
  currentPriorityFilter = btn.dataset.priorityFilter;
  savePriorityFilter(currentPriorityFilter);
  updatePriorityFilterButtons();
  render(tasks);
}

function handleExport() {
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'todo-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    try {
      const imported = JSON.parse(reader.result);
      tasks = importTasks(tasks, imported);
      saveTasks(tasks);
      render(tasks);
    } catch(err) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function init() {
  tasks = loadTasks();
  currentFilter = loadFilter();
  currentTheme = loadTheme();
  currentPriorityFilter = loadPriorityFilter();
  applyTheme(currentTheme);
  updateFilterButtons();
  updatePriorityFilterButtons();
  render(tasks);

  document.getElementById('new-task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  document.getElementById('todo-list').addEventListener('click', handleListClick);
  document.getElementById('todo-list').addEventListener('dblclick', handleListDblClick);
  document.querySelector('.filters:not(.filters--priority)').addEventListener('click', handleFilterClick);
  document.querySelector('.filters--priority').addEventListener('click', handlePriorityFilterClick);
  document.querySelector('.clear-completed').addEventListener('click', handleClearCompleted);
  document.querySelector('.theme-toggle').addEventListener('click', handleThemeToggle);
  document.querySelector('.export-btn').addEventListener('click', handleExport);
  document.querySelector('.import-btn').addEventListener('click', () => document.getElementById('import-input').click());
  document.getElementById('import-input').addEventListener('change', handleImport);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}