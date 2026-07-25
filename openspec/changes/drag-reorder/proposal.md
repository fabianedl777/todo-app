# Proposal: Drag & Drop Reorder

## Problem

Tasks can't be reordered. Users create tasks in order of entry but can't rearrange them by priority or preference. The PRD calls for drag & drop reorder (P1).

## Solution

Simple HTML5 Drag & Drop API — drop one task onto another to reorder.

**Enfoque mínimo viable:**
1. Each `<li>` gets `draggable="true"`
2. `dragstart` → store dragged task id + add visual class
3. `dragover` → `e.preventDefault()` (enables drop) + highlight target
4. `drop` → read ids, call `reorderTasks`, save, re-render
5. `dragend` → clean up visual classes

**Pure function:** `reorderTasks(tasks, fromId, toId)` — moves task from its current position to the position of the target task. Testable, no DOM.

**What we avoid (complexity reduction):**
- No live preview during drag
- No placeholder element
- No mouse Y position calculation
- No insert-between detection — drop ON an item swaps positions

## Scope

1. `reorderTasks` pure function
2. `draggable="true"` on task items
3. Drag event handlers (dragstart, dragover, drop, dragend)
4. CSS for drag states (dragging, drag-over highlight)
5. Disable drag when filter is active (only reorder in "All" + priority "All" to avoid confusion)

## Architecture

### Pure Function

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

### DOM Events

Single listeners on `#todo-list` (event delegation, same pattern as click/dblclick):

- `dragstart` → `e.dataTransfer.setData('text/plain', li.dataset.id)`, add `.todo-item--dragging`
- `dragover` → `e.preventDefault()`, add `.todo-item--drag-over` to target
- `dragleave` → remove `.todo-item--drag-over`
- `drop` → `e.preventDefault()`, read fromId + toId, call `reorderTasks`, save, render
- `dragend` → remove all drag classes

### Guard

Only allow drag when `currentFilter === 'all'` AND `currentPriorityFilter === 'all'`. Reordering with active filters would be confusing (user sees subset, reorders subset, but array has hidden items). Add `draggable` attribute conditionally in `render()`.

### CSS

```css
.todo-item--dragging { opacity: 0.4; }
.todo-item--drag-over { border-top: 2px solid var(--accent); }
```