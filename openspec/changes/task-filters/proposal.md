# Proposal: Task Filters — All / Active / Completed

## Problem

The TODO app currently shows all tasks in a single flat list. As the list grows, completed tasks clutter the view and it becomes hard to focus on what's pending. Users need a way to filter tasks by status: see everything, see only active tasks, or see only completed tasks.

## Solution

Add a filter bar below the input (above the task list) with three buttons acting as tabs:

- **All** — shows every task (default)
- **Active** — shows only tasks where `completed === false`
- **Completed** — shows only tasks where `completed === true`

The filter state is stored in `localStorage` under key `filter` so it survives page reloads. The active filter button is visually highlighted.

Implementation approach:

- **Pure function** `filterTasks(tasks, filter)` — takes the tasks array and a filter string (`'all'`, `'active'`, `'completed'`), returns a filtered array. This is trivially testable with `node:test`.
- **DOM layer** — a `<div class="filters">` with three `<button>` elements. Click handler updates the current filter, re-renders, and persists the filter choice.
- **`render()` update** — instead of rendering all tasks, render `filterTasks(tasks, currentFilter)`.
- **Persistence** — `currentFilter` saved to `localStorage` on every filter change, restored on `init()`.

## Scope

Exactly three features:

1. **Filter bar UI** — three buttons (All / Active / Completed) below the input, above the list.
2. **Filter logic** — `filterTasks(tasks, filter)` pure function that returns the visible subset.
3. **Filter persistence** — current filter saved to `localStorage` and restored on page load.

Nothing beyond these three. No counters, no clear-completed, no priority filters — those are separate changes.

## Architecture

### Pure Function

```js
function filterTasks(tasks, filter) {
  if (filter === 'active') return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return tasks; // 'all' or unknown → return as-is (new reference for immutability)
}
```

**Immutability:** For `'all'`, return a shallow copy `[...tasks]` to maintain the invariant that pure functions return new references. For `'active'` and `'completed'`, `.filter()` already returns a new array.

### Storage

`filter` is stored as a plain string in `localStorage` under key `filter`. Valid values: `'all'`, `'active'`, `'completed'`. Default: `'all'`. Invalid/missing values default to `'all'`.

### DOM Structure

```html
<div class="filters">
  <button class="filter-btn filter-btn--active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="active">Active</button>
  <button class="filter-btn" data-filter="completed">Completed</button>
</div>
```

The `--active` modifier class highlights the currently selected filter.

### Event Delegation

A single click listener on `.filters` container inspects `e.target.closest('.filter-btn')` to determine which filter was clicked — same delegation pattern already used for the task list.

## TDD Plan

1. Write tests for `filterTasks` pure function (all/active/completed/empty/invalid filter)
2. Implement `filterTasks`
3. Add filter bar HTML
4. Add filter bar CSS
5. Wire filter click handler
6. Update `render()` to use `filterTasks`
7. Add filter persistence (save/load)
8. Update `init()` to restore filter
9. Full test suite green
10. Manual verification