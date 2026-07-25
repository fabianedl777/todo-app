# Proposal: Task Priorities — Alta/Media/Baja with Color Coding

## Problem

All tasks look the same visually. Users can't quickly identify which tasks are urgent vs. low-priority. The PRD calls for priorities (Alta/Media/Baja) with color coding.

## Solution

Add a priority field to each task. Three levels:

- **High** (red accent) — urgent, needs attention
- **Medium** (default/no accent) — normal
- **Low** (muted/blue accent) — can wait

Implementation:

- **Pure function** `setPriority(tasks, id, priority)` — returns new array with updated priority. Pure, testable.
- **`createTask` update** — new tasks default to `'medium'` priority.
- **DOM layer** — priority indicator on each `<li>` (colored dot or left border). Click to cycle through priorities.
- **Data model** — `task.priority` field: `'high'`, `'medium'`, `'low'`. Default: `'medium'`.
- **Persistence** — priority is part of the task object, saved with `saveTasks` already. No new storage key needed.

## Scope

1. **Priority field** on tasks (`high`/`medium`/`low`).
2. **`setPriority` pure function** — update a task's priority.
3. **`createTask` update** — new tasks get `'medium'` by default.
4. **Visual indicator** — colored left border on each task item based on priority.
5. **Click to cycle** — click the priority dot to cycle: medium → high → low → medium.

No priority filters — that's a P2 feature. No drag-to-reorder — separate change.

## Architecture

### Pure Function

```js
function setPriority(tasks, id, priority) {
  if (!['high', 'medium', 'low'].includes(priority)) return tasks.map(t => t);
  return tasks.map(t => t.id === id ? { ...t, priority } : t);
}
```

### createTask Update

```js
return [{
  id: generateId(),
  text: trimmed,
  completed: false,
  priority: 'medium',    // NEW
  createdAt: new Date().toISOString(),
}, ...tasks];
```

### CSS — Priority Indicator

```css
.todo-item { border-left: 3px solid transparent; }
.todo-item--high { border-left-color: var(--danger); }
.todo-item--low { border-left-color: var(--accent); }
.todo-item--medium { border-left-color: transparent; }
```

Plus a clickable dot element:

```html
<span class="todo__priority" data-priority="medium">●</span>
```

### Event Handling

Click on `.todo__priority` cycles priority: `medium → high → low → medium`.

Handled in `handleListClick` (existing event delegation on `#todo-list`).