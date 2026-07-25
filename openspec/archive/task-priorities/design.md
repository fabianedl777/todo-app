# Design: Task Priorities

---

## 1. Pure Function (SECTION 1)

```js
function setPriority(tasks, id, priority) {
  if (!['high', 'medium', 'low'].includes(priority)) return tasks.map(t => t);
  return tasks.map(t => t.id === id ? { ...t, priority } : t);
}
```

## 2. createTask Update

Add `priority: 'medium'` to new task object:

```js
return [{
  id: generateId(),
  text: trimmed,
  completed: false,
  priority: 'medium',
  createdAt: new Date().toISOString(),
}, ...tasks];
```

## 3. Export

Add `setPriority` to `module.exports`.

## 4. DOM Layer

### 4.1 Render — Priority Dot

In `render()`, add a priority span to each `<li>`:

```js
const priorityDot = document.createElement('span');
priorityDot.className = 'todo__priority todo__priority--' + (task.priority || 'medium');
priorityDot.textContent = '●';
priorityDot.dataset.id = task.id;
```

Insert before checkbox in `li.append()`.

### 4.2 CSS

```css
.todo__priority {
  flex-shrink: 0;
  cursor: pointer;
  font-size: 0.7rem;
  user-select: none;
}

.todo__priority--high { color: var(--danger); }
.todo__priority--medium { color: var(--muted); }
.todo__priority--low { color: var(--accent); }
```

### 4.3 Click to Cycle

In `handleListClick`, add check for `.todo__priority`:

```js
if (e.target.classList.contains('todo__priority')) {
  const current = tasks.find(t => t.id === id);
  if (!current) return;
  const order = ['medium', 'high', 'low'];
  const nextIdx = (order.indexOf(current.priority || 'medium') + 1) % 3;
  tasks = setPriority(tasks, id, order[nextIdx]);
  saveTasks(tasks);
  render(tasks);
}
```

### 4.4 Backward Compatibility

Existing tasks in localStorage without `priority` field: `task.priority || 'medium'` handles it. No migration needed.