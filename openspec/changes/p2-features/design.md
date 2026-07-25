# Design: P2 Features

---

## 1. Priority Filters

### HTML

Second filter row below existing one:

```html
<div class="filters filters--priority">
  <button class="filter-btn filter-btn--active" data-priority-filter="all">All</button>
  <button class="filter-btn" data-priority-filter="high">High</button>
  <button class="filter-btn" data-priority-filter="medium">Medium</button>
  <button class="filter-btn" data-priority-filter="low">Low</button>
</div>
```

### Pure Function

```js
function filterByPriority(tasks, priority) {
  if (priority === 'all') return [...tasks];
  return tasks.filter(t => (t.priority || 'medium') === priority);
}
```

### State + Storage

```js
let currentPriorityFilter = 'all';
// savePriorityFilter / loadPriorityFilter — same pattern as filter/theme
```

### Render Integration

```js
let visible = filterTasks(tasks, currentFilter);
visible = filterByPriority(visible, currentPriorityFilter);
```

### Handler

```js
function handlePriorityFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentPriorityFilter = btn.dataset.priorityFilter;
  savePriorityFilter(currentPriorityFilter);
  updatePriorityFilterButtons();
  render(tasks);
}
```

---

## 2. Creation Date Visible

### Pure Function

```js
function formatRelativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

### DOM

In `render()`, add date span inside each `<li>`:

```js
const dateSpan = document.createElement('span');
dateSpan.className = 'todo__date';
dateSpan.textContent = formatRelativeTime(task.createdAt);
```

After `todo__text`, before `todo__delete`.

### CSS

```css
.todo__date {
  font-size: 0.7rem;
  color: var(--muted);
  white-space: nowrap;
  align-self: flex-end;
}
```

---

## 3. Animations

### CSS

```css
@keyframes slideOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}

@keyframes completePulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 0.65; }
}
```

### Delete Animation

In `handleListClick`, before deleting:

```js
if (e.target.classList.contains('todo__delete')) {
  const li = e.target.closest('.todo-item');
  li.classList.add('todo-item--removing');
  setTimeout(() => {
    tasks = deleteTask(tasks, id);
    saveTasks(tasks);
    render(tasks);
  }, 200);
  return;
}
```

### Complete Animation

```css
.todo-item--completing {
  animation: completePulse 0.3s ease forwards;
}
```

---

## 4. Export/Import JSON

### Pure Function

```js
function importTasks(existing, imported) {
  if (!Array.isArray(imported)) return [...existing];
  const existingIds = new Set(existing.map(t => t.id));
  const newTasks = imported.filter(t =>
    t && t.id && !existingIds.has(t.id) && typeof t.text === 'string'
  );
  return [...newTasks, ...existing];
}
```

### DOM

Add to footer:

```html
<button class="export-btn">Export</button>
<input type="file" id="import-input" accept=".json" style="display:none">
<button class="import-btn">Import</button>
```

### Handlers

```js
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
```

### CSS

```css
.export-btn, .import-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}
.export-btn:hover, .import-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
```

---

## 5. Exports

Add `filterByPriority`, `formatRelativeTime`, `importTasks` to `module.exports`.

---

## 6. Tests

### filterByPriority
- 'all' returns all tasks (new ref)
- 'high' returns only high priority
- 'medium' returns only medium
- 'low' returns only low
- tasks without priority treated as 'medium'
- empty array returns empty
- does not mutate input
- returns new reference

### formatRelativeTime
- "just now" for < 60s
- "5m ago" for 5 minutes
- "2h ago" for 2 hours
- "3d ago" for 3 days
- "Jul 25" for older
- invalid input returns 'unknown'

### importTasks
- merges new tasks into existing
- dedupes by id
- invalid input (not array) returns existing unchanged
- filters out tasks without id or text
- empty imported returns existing unchanged
- does not mutate input