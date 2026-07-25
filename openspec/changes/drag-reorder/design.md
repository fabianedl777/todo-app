# Design: Drag & Drop Reorder

---

## 1. Pure Function (SECTION 1)

```js
function reorderTasks(tasks, fromId, toId) {
  if (fromId === toId) return [...tasks];
  const fromIdx = tasks.findIndex(t => t.id === fromId);
  const toIdx = tasks.findIndex(t => t.id === toId);
  if (fromIdx === -1 || toIdx === -1) return [...tasks];
  const result = [...tasks];
  const [moved] = result.splice(fromIdx, 1);
  result.splice(toIdx, 0, moved);
  return result;
}
```

## 2. Export

Add `reorderTasks` to `module.exports`.

## 3. DOM Layer

### 3.1 Render — draggable attribute

In `render()`, set `draggable` only when both filters are 'all':

```js
const canDrag = currentFilter === 'all' && currentPriorityFilter === 'all';
li.draggable = canDrag;
```

### 3.2 Event Handlers (delegated on #todo-list)

```js
function handleDragStart(e) {
  const li = e.target.closest('.todo-item');
  if (!li || !li.draggable) return;
  e.dataTransfer.setData('text/plain', li.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
  li.classList.add('todo-item--dragging');
}

function handleDragOver(e) {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  li.classList.add('todo-item--drag-over');
}

function handleDragLeave(e) {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  li.classList.remove('todo-item--drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const li = e.target.closest('.todo-item');
  if (!li) return;
  li.classList.remove('todo-item--drag-over');
  const fromId = e.dataTransfer.getData('text/plain');
  const toId = li.dataset.id;
  if (!fromId || !toId) return;
  tasks = reorderTasks(tasks, fromId, toId);
  saveTasks(tasks);
  render(tasks);
}

function handleDragEnd(e) {
  document.querySelectorAll('.todo-item--dragging, .todo-item--drag-over').forEach(el => {
    el.classList.remove('todo-item--dragging', 'todo-item--drag-over');
  });
}
```

### 3.3 Init Wiring

```js
const ul = document.getElementById('todo-list');
ul.addEventListener('dragstart', handleDragStart);
ul.addEventListener('dragover', handleDragOver);
ul.addEventListener('dragleave', handleDragLeave);
ul.addEventListener('drop', handleDrop);
ul.addEventListener('dragend', handleDragEnd);
```

## 4. CSS

```css
.todo-item--dragging {
  opacity: 0.4;
}

.todo-item--drag-over {
  border-top: 2px solid var(--accent);
}
```

## 5. Tests

### reorderTasks
- Move from index 2 to index 0 → [C, A, B]
- Move from index 0 to index 2 → [B, C, A]
- Same id → unchanged (new ref)
- Non-existent fromId → unchanged
- Non-existent toId → unchanged
- Empty array → empty
- Does not mutate input
- Returns new reference