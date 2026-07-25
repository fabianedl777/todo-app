# Proposal: P2 Features — Priority Filters, Creation Date, Animations, Export/Import

## Problem

Four P2 features from the PRD are missing:
1. Can't filter tasks by priority — only by completion status
2. No visible creation date on tasks — users can't see when a task was created
3. No animations on task create/delete — feels abrupt
4. No way to backup/restore tasks — data only lives in localStorage

## Solution

### 1. Priority Filters

Add filter buttons for priority: All / High / Medium / Low — alongside the existing completion filters. Two-row filter bar:
- Row 1: All / Active / Completed (existing)
- Row 2: All / High / Medium / Low (new)

Pure function `filterByPriority(tasks, priority)` — returns filtered array. Combined with `filterTasks` in `render()`.

### 2. Creation Date Visible

Show a small timestamp below each task text: "Created 2h ago" or "Created Jul 25". Uses `task.createdAt` (already stored). Relative time format.

Pure function `formatRelativeTime(isoString)` — returns string like "just now", "5m ago", "2h ago", "3d ago", "Jul 25".

### 3. Animations de entrada/salida

CSS animations:
- **Create**: `slideIn` already exists — add to new tasks
- **Delete**: `slideOut` animation before removing from DOM
- **Complete**: `fadeOut` quick pulse on strikethrough

No new JS logic — CSS only + a small timeout in `handleListClick` for delete animation.

### 4. Exportar/Importar JSON

Two buttons in footer:
- **Export** — downloads `todo-backup-{date}.json` with all tasks
- **Import** — file input, reads JSON, validates, merges with existing tasks

Pure function `importTasks(existing, imported)` — merges arrays, dedupes by id.

## Scope

Four features in one change. All are additive — no breaking changes to existing functionality.

## Architecture

### Pure Functions (SECTION 1)

```js
function filterByPriority(tasks, priority) {
  if (priority === 'all') return [...tasks];
  return tasks.filter(t => (t.priority || 'medium') === priority);
}

function formatRelativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function importTasks(existing, imported) {
  if (!Array.isArray(imported)) return [...existing];
  const existingIds = new Set(existing.map(t => t.id));
  const newTasks = imported.filter(t => t && t.id && !existingIds.has(t.id) && typeof t.text === 'string');
  return [...newTasks, ...existing];
}
```

### DOM Layer

- Second filter row in HTML
- `currentPriorityFilter` state variable + `savePriorityFilter`/`loadPriorityFilter`
- `render()` applies both `filterTasks` AND `filterByPriority`
- Timestamp `<span class="todo__date">` in each task item
- Export/Import buttons + handlers in footer
- CSS animations for create/delete/complete

### Storage

New key: `priorityFilter` (same pattern as `filter` and `theme`).