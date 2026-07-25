# Design: Dark Mode + Empty State

---

## 1. Dark Mode

### 1.1 CSS Variables

Replace all hardcoded colors with CSS variables:

```css
:root {
  --bg: #f5f5f5;
  --text: #333;
  --item-bg: #fff;
  --border: #eee;
  --muted: #999;
  --accent: #4a90d9;
  --accent-text: #fff;
  --danger: #cc3333;
}

[data-theme="dark"] {
  --bg: #1a1a2e;
  --text: #e0e0e0;
  --item-bg: #16213e;
  --border: #2a2a4a;
  --muted: #777;
  --accent: #4a90d9;
  --accent-text: #fff;
  --danger: #e74c3c;
}
```

All existing selectors use `var(--xxx)`. No structural CSS changes — just color references.

### 1.2 HTML

Add toggle button in header:

```html
<h1>TODO <button class="theme-toggle" aria-label="Toggle dark mode">🌙</button></h1>
```

### 1.3 Storage Functions

```js
function saveTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

function loadTheme() {
  try {
    const t = localStorage.getItem('theme');
    return t === 'dark' || t === 'light' ? t : 'light';
  } catch (e) { return 'light'; }
}
```

### 1.4 Toggle Handler

```js
let currentTheme = 'light';

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
```

### 1.5 Init

```js
currentTheme = loadTheme();
applyTheme(currentTheme);
// wire: document.querySelector('.theme-toggle').addEventListener('click', handleThemeToggle);
```

### 1.6 Exports

Add `saveTheme`, `loadTheme` to exports (testable in Node).

---

## 2. Empty State

### 2.1 Render Integration

At the end of `render()`, after building list items, if `visible.length === 0`:

```js
if (visible.length === 0) {
  const li = document.createElement('li');
  li.className = 'empty-state';
  li.textContent = getEmptyMessage();
  ul.appendChild(li);
}
```

### 2.2 Message Function

```js
function getEmptyMessage() {
  if (tasks.length === 0) return 'No tasks yet. Add one above!';
  if (currentFilter === 'active') return 'No active tasks. Nice work!';
  if (currentFilter === 'completed') return 'No completed tasks yet.';
  return 'Nothing to show.';
}
```

### 2.3 CSS

```css
.empty-state {
  text-align: center;
  color: var(--muted);
  font-size: 0.875rem;
  padding: 2rem 1rem;
  list-style: none;
}
```

---

## 3. Export Update

```js
module.exports = {
  createTask, toggleTask, deleteTask, editTask, filterTasks, countActive, clearCompleted,
  saveTasks, loadTasks, saveFilter, loadFilter,
  saveTheme, loadTheme,
};
```

No pure function tests needed for `saveTheme`/`loadTheme` — thin wrappers like `saveFilter`/`loadFilter`. Manual verification sufficient.