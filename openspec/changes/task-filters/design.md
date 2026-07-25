# Design: Task Filters

Architecture decisions and implementation approach for the task-filters change. This document is implementation-ready.

---

## 1. Module Architecture

### 1.1 Changes to Existing Files

No new files. All changes are additions to existing files:

- `app.js` — add `filterTasks` pure function (SECTION 1), add filter state + persistence, update `init()` and `render()`, add filter bar DOM creation and event wiring (SECTION 3).
- `index.html` — add `<div class="filters">` between input and list.
- `styles.css` — add filter bar styles.
- `test/task.test.js` — add `filterTasks` test block.
- `test/helpers.js` — no changes needed (existing `makeTasks` factory is sufficient).

### 1.2 New Pure Function in SECTION 1

```js
function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return [...tasks]; // 'all' or unknown → new reference
}
```

**Why spread for 'all':** `.filter()` always returns a new array. For `'all'`, we could return `tasks` directly, but the immutability invariant requires a new reference. `[...tasks]` creates a shallow copy in O(n).

### 1.3 Filter State

Module-scoped variable in SECTION 3:

```js
let currentFilter = 'all';
```

### 1.4 Filter Persistence

Two helper functions in SECTION 2 (Storage Module):

```js
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
```

**Why explicit validation in `loadFilter`:** Unlike `loadTasks` which uses `Array.isArray` as a guard, filter values are strings. We validate against the three known values explicitly. Any other value (including `null` from missing key) defaults to `'all'`.

### 1.5 Export Update

Add `filterTasks` to the `module.exports` guard:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTask,
    toggleTask,
    deleteTask,
    editTask,
    filterTasks,    // NEW
    saveTasks,
    loadTasks,
    saveFilter,     // NEW
    loadFilter,     // NEW
  };
}
```

---

## 2. DOM Structure

### 2.1 HTML Addition (index.html)

Between `#new-task-input` and `#todo-list`:

```html
<div class="filters">
  <button class="filter-btn filter-btn--active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="active">Active</button>
  <button class="filter-btn" data-filter="completed">Completed</button>
</div>
```

The `filter-btn--active` class on the "All" button marks it as the default selected filter.

### 2.2 CSS Addition (styles.css)

```css
/* Filter bar */
.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-btn {
  padding: 0.4rem 0.9rem;
  font-size: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.filter-btn:hover {
  border-color: #4a90d9;
  color: #4a90d9;
}

.filter-btn--active {
  background: #4a90d9;
  border-color: #4a90d9;
  color: #fff;
}

.filter-btn--active:hover {
  color: #fff;
}
```

**Design choice:** Pill/rounded buttons with a filled blue background for the active state. Hover on inactive buttons hints at the accent color. Simple, clean, no animations beyond a quick color transition.

---

## 3. Data Flow

### 3.1 Filter Change

```
User clicks filter button
  → handleFilterClick(e)
    → button = e.target.closest('.filter-btn')
    → filter = button.dataset.filter
    → currentFilter = filter
    → saveFilter(filter)              // persist
    → updateFilterButtons()           // update active class
    → render(tasks)                   // re-render with new filter
```

### 3.2 Render with Filter

```
render(tasks)
  → visibleTasks = filterTasks(tasks, currentFilter)
  → clear #todo-list
  → for each task in visibleTasks → create <li> → append to #todo-list
```

### 3.3 Init with Saved Filter

```
init()
  → tasks = loadTasks()
  → currentFilter = loadFilter()      // NEW
  → updateFilterButtons()             // NEW — sync DOM with currentFilter
  → render(tasks)
  → wire event listeners (input, list, filters)  // NEW: filter click listener
```

---

## 4. Event Delegation

### 4.1 Filter Click Handler

Single click listener on `.filters` container:

```js
function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  saveFilter(currentFilter);
  updateFilterButtons();
  render(tasks);
}
```

### 4.2 Update Active Button

```js
function updateFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.dataset.filter === currentFilter);
  });
}
```

This uses `classList.toggle` with the second argument (force) — clean one-liner that adds the class if the button matches the current filter, removes it otherwise.

### 4.3 Init Update

```js
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

  // NEW: filter bar listener
  document.querySelector('.filters').addEventListener('click', handleFilterClick);
}
```

---

## 5. Testing Architecture

### 5.1 New Tests in test/task.test.js

```
describe('filterTasks')
  - 'all' returns all tasks (new reference, input unchanged)
  - 'active' returns only non-completed tasks
  - 'completed' returns only completed tasks
  - empty array returns empty array for all filters
  - invalid filter value defaults to 'all' (returns all tasks)
  - does not mutate input array
  - returns new array reference (immutability invariant)
```

### 5.2 Test for Storage

Storage tests for `saveFilter`/`loadFilter` are NOT included in this change. The filter persistence is simple string storage with validation — manually verified. If we later need automated tests for it, they would go in `test/storage.test.js`.

**Rationale:** `saveFilter` and `loadFilter` are thin wrappers over `localStorage.setItem`/`getItem` with trivial validation. The pure function `filterTasks` is where the real logic lives and where tests add value.

### 5.3 Test File Update

Add to the `require` destructuring in `test/task.test.js`:

```js
const { createTask, toggleTask, deleteTask, editTask, filterTasks } = require('../app.js');
```

Add new `describe('filterTasks')` block after the existing `describe('editTask')` block and before `describe('Immutability invariant')`.

---

## 6. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Filter as module-scoped variable | `let currentFilter = 'all'` in SECTION 3 | Same pattern as `let tasks` — single source of truth |
| Spread for 'all' filter | `[...tasks]` instead of `return tasks` | Maintains immutability invariant (new reference) |
| Explicit validation in `loadFilter` | Check against 3 known strings | Simple, safe, no schema needed |
| Pill-style buttons | `border-radius: 999px` | Clean, modern, visually distinct from task items |
| Event delegation on `.filters` | Single listener on container | Same pattern as task list — handles dynamic state |
| `classList.toggle` with force | `btn.classList.toggle('filter-btn--active', condition)` | Cleanest way to sync active state |
| No storage tests for filter | Manual verification only | Thin wrapper, trivial logic, low test value |
| `filterTasks` exported | Added to `module.exports` | Testable in Node like other pure functions |