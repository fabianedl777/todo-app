# Design: Task Counter

Architecture decisions and implementation approach for the task-counter change.

---

## 1. Changes to Existing Files

No new files. All changes are additions to existing files:

- `app.js` — add `countActive` pure function (SECTION 1), add `updateTaskCount` DOM function (SECTION 3), call `updateTaskCount` from `render()`.
- `index.html` — add `<footer class="app-footer">` with `<span class="task-count">` after `#todo-list`.
- `styles.css` — add footer and counter styles.
- `test/task.test.js` — add `countActive` test block.

---

## 2. Pure Function (SECTION 1)

```js
function countActive(tasks) {
  return tasks.filter(t => !t.completed).length;
}
```

Trivial — filters non-completed tasks and returns the count. No edge cases: empty array returns 0, all-completed returns 0, all-active returns length.

---

## 3. Export Update

Add `countActive` to `module.exports`:

```js
module.exports = {
  createTask, toggleTask, deleteTask, editTask, filterTasks, countActive,
  saveTasks, loadTasks, saveFilter, loadFilter,
};
```

---

## 4. DOM Layer (SECTION 3)

### 4.1 HTML (index.html)

After `#todo-list`, inside `<main class="app">`:

```html
<footer class="app-footer">
  <span class="task-count">0 items left</span>
</footer>
```

Default text "0 items left" — updated by `updateTaskCount` on init.

### 4.2 Update Function

```js
function updateTaskCount(tasks) {
  const count = countActive(tasks);
  const el = document.querySelector('.task-count');
  if (el) el.textContent = count + (count === 1 ? ' item left' : ' items left');
}
```

Called from `render(tasks)` after building the list. Uses the **full** `tasks` array (not the filtered subset) so the counter always shows total active tasks.

### 4.3 Render Integration

Add one line at the end of `render()`:

```js
function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';
  const visible = filterTasks(tasks, currentFilter);
  for (const task of visible) { /* ... build <li> ... */ }
  updateTaskCount(tasks);  // NEW — always count from full array
}
```

No new event listeners needed. The counter updates automatically whenever `render()` is called — which happens on every mutation (create, toggle, delete, edit) and on filter change.

---

## 5. CSS

```css
/* Footer */
.app-footer {
  margin-top: 1rem;
  padding: 0.5rem 0;
  font-size: 0.8125rem;
  color: #999;
}

.task-count {
  /* inherits from footer */
}
```

Minimal — small muted text, left-aligned, sits below the list. No border, no background.