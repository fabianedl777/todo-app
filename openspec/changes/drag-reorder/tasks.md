# Tasks: Drag & Drop Reorder

## 1. TDD: reorderTasks Pure Function

- [ ] 1.1 Add `reorderTasks` to `require('../app.js')` destructuring in `test/task.test.js`
- [ ] 1.2 Write test: move task from index 2 to index 0 → [C, A, B]
- [ ] 1.3 Write test: move task from index 0 to index 2 → [B, C, A]
- [ ] 1.4 Write test: same id returns unchanged (new reference)
- [ ] 1.5 Write test: non-existent fromId returns unchanged
- [ ] 1.6 Write test: non-existent toId returns unchanged
- [ ] 1.7 Write test: empty array returns empty
- [ ] 1.8 Write test: does not mutate input array
- [ ] 1.9 Write test: returns new reference
- [ ] 1.10 Implement `reorderTasks(tasks, fromId, toId)` in `app.js` SECTION 1
- [ ] 1.11 Add `reorderTasks` to `module.exports`
- [ ] 1.12 Run tests, confirm Green

## 2. DOM Layer — draggable attribute

- [ ] 2.1 In `render()`, set `li.draggable` only when `currentFilter === 'all' && currentPriorityFilter === 'all'`

## 3. DOM Layer — Drag Event Handlers

- [ ] 3.1 Implement `handleDragStart(e)` — set dataTransfer, add `--dragging` class
- [ ] 3.2 Implement `handleDragOver(e)` — preventDefault, add `--drag-over` class
- [ ] 3.3 Implement `handleDragLeave(e)` — remove `--drag-over` class
- [ ] 3.4 Implement `handleDrop(e)` — read ids, call `reorderTasks`, save, render
- [ ] 3.5 Implement `handleDragEnd(e)` — clean up all drag classes

## 4. DOM Layer — Event Wiring

- [ ] 4.1 Wire dragstart, dragover, dragleave, drop, dragend on `#todo-list` in `init()`

## 5. CSS

- [ ] 5.1 Add `.todo-item--dragging` (opacity 0.4)
- [ ] 5.2 Add `.todo-item--drag-over` (top border accent)

## 6. Full Test Suite — Green

- [ ] 6.1 Run `node --test test/*.test.js`, confirm all green
- [ ] 6.2 Commit and push

## 7. Manual Verification

- [ ] 7.1 Drag enabled with both filters on All
- [ ] 7.2 Drag task C onto task A → order changes to [C, A, B]
- [ ] 7.3 Reload → order persists
- [ ] 7.4 Switch to Active filter → items not draggable
- [ ] 7.5 Visual feedback: dragging opacity, drop target border
- [ ] 7.6 Works in light and dark mode