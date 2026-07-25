# Design: Clear Completed

Architecture decisions and implementation approach for the clear-completed change.

---

## 1. Changes to Existing Files

- `app.js` — add `clearCompleted` pure function (SECTION 1), add to exports, add `handleClearCompleted` and visibility toggle in SECTION 3, wire listener in `init()`.
- `index.html` — add `<button class="clear-completed">` in footer.
- `styles.css` — update footer to flex, add button styles.
- `test/task.test.js` — add `clearCompleted` test block.

---

## 2. Pure Function (SECTION 1)

```js
function clearCompleted(tasks) {
  return tasks.filter(t => !t.completed);
}
```

`.filter()` returns a new array — immutability invariant holds automatically.

---

## 3. Export Update

Add `clearCompleted` to `module.exports`.

---

## 4. DOM Layer

### 4.1 HTML (index.html)

Update footer to include button:

```html
<footer class="app-footer">
  <span class="task-count">0 items left</span>
  <button class="clear-completed">Clear completed</button>
</footer>
```

### 4.2 CSS

```css
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0.5rem 0;
  font-size: 0.8125rem;
  color: #999;
}

.clear-completed {
  background: none;
  border: none;
  color: #999;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
}

.clear-completed:hover {
  color: #cc3333;
}
```

### 4.3 Handler + Visibility

```js
function handleClearCompleted() {
  tasks = clearCompleted(tasks);
  saveTasks(tasks);
  render(tasks);
}
```

Visibility toggle in `render()` after `updateTaskCount`:

```js
const hasCompleted = tasks.some(t => t.completed);
const btn = document.querySelector('.clear-completed');
if (btn) btn.style.display = hasCompleted ? '' : 'none';
```

### 4.4 Init Wiring

```js
document.querySelector('.clear-completed').addEventListener('click', handleClearCompleted);
```