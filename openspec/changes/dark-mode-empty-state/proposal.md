# Proposal: Dark Mode + Empty State

## Problem

Two UX gaps:
1. The app is light-only. Users who prefer dark mode (or are in low-light environments) have no option. The PRD explicitly calls for dark mode with persistence.
2. When the task list is empty (no tasks, or filter shows no results), the space below the input is just blank white. No feedback, no guidance — looks broken.

## Solution

### Dark Mode

- CSS variables for all colors, swapped via `data-theme="dark"` attribute on `<html>`.
- Toggle button (🌙/☀️) in the header, next to the "TODO" title.
- Preference persisted to `localStorage` under key `theme` (`'light'` or `'dark'`).
- On `init()`, restore saved theme. Default: `'light'`.
- Pure function `applyTheme(theme)` — sets `document.documentElement.dataset.theme`.

### Empty State

- When `filterTasks(tasks, currentFilter)` returns an empty array, `render()` shows a message instead of a blank list.
- Messages vary by context:
  - No tasks at all: "No tasks yet. Add one above!"
  - Filter "Active" with no active tasks: "No active tasks. Nice work!"
  - Filter "Completed" with no completed tasks: "No completed tasks yet."
- CSS: centered, muted color, small font.

## Scope

Two features in one change:

1. **Dark mode toggle** — button + CSS variables + persistence.
2. **Empty state messages** — contextual messages when list is empty.

No priority colors, no drag & drop — those are separate changes.

## Architecture

### CSS Variables

```css
:root {
  --bg: #f5f5f5;
  --text: #333;
  --item-bg: #fff;
  --border: #eee;
  --muted: #999;
  --accent: #4a90d9;
  --danger: #cc3333;
}

[data-theme="dark"] {
  --bg: #1a1a2e;
  --text: #e0e0e0;
  --item-bg: #16213e;
  --border: #2a2a4a;
  --muted: #777;
  --accent: #4a90d9;
  --danger: #e74c3c;
}
```

All existing CSS rules updated to use `var(--xxx)` instead of hardcoded colors.

### Theme Persistence

```js
function saveTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

function loadTheme() {
  try {
    const t = localStorage.getItem('theme');
    return t === 'dark' || t === 'light' ? t : 'light';
  } catch (e) { return 'light'; }
}
```

### Empty State in render()

After building the list, if `visible.length === 0`:

```js
if (visible.length === 0) {
  const li = document.createElement('li');
  li.className = 'empty-state';
  li.textContent = getEmptyMessage();
  ul.appendChild(li);
  return; // skip counter/clear update? No — still update counter
}
```

```js
function getEmptyMessage() {
  if (tasks.length === 0) return 'No tasks yet. Add one above!';
  if (currentFilter === 'active') return 'No active tasks. Nice work!';
  if (currentFilter === 'completed') return 'No completed tasks yet.';
  return 'Nothing to show.';
}
```