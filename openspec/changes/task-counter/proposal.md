# Proposal: Task Counter — Active Tasks Count

## Problem

The TODO app shows tasks but doesn't communicate how many tasks are left to do. Users have no quick visual summary of their pending workload. A counter at the bottom of the app provides instant context: "3 tasks left" tells you what's pending without scanning the list.

## Solution

Add a footer bar below the task list with a text counter showing the number of active (non-completed) tasks:

- **"X items left"** — where X is `tasks.filter(t => !t.completed).length`
- Singular/plural: "1 item left" vs "3 items left" vs "0 items left"

Implementation:

- **Pure function** `countActive(tasks)` — returns the number of non-completed tasks. Trivially testable.
- **DOM layer** — a `<footer class="app-footer">` with a `<span class="task-count">`. Updated on every `render()` call.
- **No persistence** — the counter is derived from the tasks array, not stored. It updates automatically whenever tasks change.

## Scope

Exactly one feature:

1. **Active task counter** — displays "X items left" below the task list, updates on every mutation.

No clear-completed button, no completed count, no filters by count — those are separate changes.

## Architecture

### Pure Function

```js
function countActive(tasks) {
  return tasks.filter(t => !t.completed).length;
}
```

### DOM Structure

```html
<footer class="app-footer">
  <span class="task-count">3 items left</span>
</footer>
```

Added after `#todo-list`, inside `<main class="app">`.

### Render Integration

`render(tasks)` already filters and renders the list. After building the list items, it also updates the counter text:

```js
function updateTaskCount(tasks) {
  const count = countActive(tasks);
  const el = document.querySelector('.task-count');
  if (el) el.textContent = count + (count === 1 ? ' item left' : ' items left');
}
```

Called from `render()` after the list is built. Uses the full `tasks` array (not the filtered subset) so the count always reflects total active tasks regardless of which filter is active.

### CSS

Minimal footer styling — small text, muted color, left-aligned.