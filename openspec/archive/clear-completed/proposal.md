# Proposal: Clear Completed — Bulk Delete

## Problem

As tasks accumulate, completed tasks clutter the list even with filters. Users need a quick way to remove all completed tasks at once — a single click that purges every task where `completed === true`.

## Solution

Add a "Clear completed" button in the footer, next to the task counter. One click removes all completed tasks from the tasks array, persists the new state, and re-renders.

- **Pure function** `clearCompleted(tasks)` — returns a new array with only non-completed tasks. Trivially testable.
- **DOM layer** — a `<button class="clear-completed">` in the footer. Click handler calls `clearCompleted`, saves, re-renders.
- **Visibility** — the button is only visible when there is at least one completed task. Hidden when zero completed tasks exist.

## Scope

Exactly one feature:

1. **Clear completed button** — removes all completed tasks with one click, persists, re-renders.

No confirmation dialog, no undo — this is a TODO app, not a nuclear launch system.

## Architecture

### Pure Function

```js
function clearCompleted(tasks) {
  return tasks.filter(t => !t.completed);
}
```

Returns a new array (`.filter()` guarantee). Input array not mutated.

### DOM Structure

```html
<footer class="app-footer">
  <span class="task-count">3 items left</span>
  <button class="clear-completed">Clear completed</button>
</footer>
```

Footer becomes a flex container: counter on the left, button on the right.

### Visibility Logic

In `render()`, after updating the counter, toggle button visibility:

```js
const hasCompleted = tasks.some(t => t.completed);
const btn = document.querySelector('.clear-completed');
if (btn) btn.style.display = hasCompleted ? '' : 'none';
```

### Event Handling

Single click listener on the button (not delegated — it's a standalone element):

```js
document.querySelector('.clear-completed').addEventListener('click', handleClearCompleted);
```

```js
function handleClearCompleted() {
  tasks = clearCompleted(tasks);
  saveTasks(tasks);
  render(tasks);
}
```

Wired in `init()`.