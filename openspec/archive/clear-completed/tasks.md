# Tasks: Clear Completed — Bulk Delete

## 1. TDD: clearCompleted Pure Function

- [ ] 1.1 Add `clearCompleted` to `require('../app.js')` destructuring in `test/task.test.js`
- [ ] 1.2 Write test: `clearCompleted` removes all completed tasks (3 active, 2 completed → 3 active remain)
- [ ] 1.3 Write test: `clearCompleted` returns empty array when all tasks completed
- [ ] 1.4 Write test: `clearCompleted` returns same content when no completed tasks (new reference)
- [ ] 1.5 Write test: `clearCompleted` on empty array returns empty array
- [ ] 1.6 Write test: `clearCompleted` does not mutate input array
- [ ] 1.7 Write test: `clearCompleted` returns new array reference (immutability)
- [ ] 1.8 Implement `clearCompleted(tasks)` in `app.js` SECTION 1: `return tasks.filter(t => !t.completed)` — run tests, confirm Green
- [ ] 1.9 Add `clearCompleted` to `module.exports` guard

## 2. DOM Layer — Footer HTML

- [ ] 2.1 Add `<button class="clear-completed">Clear completed</button>` to footer in `index.html`, after `.task-count`

## 3. DOM Layer — Footer CSS

- [ ] 3.1 Update `.app-footer` to flex with `justify-content: space-between` and `align-items: center`
- [ ] 3.2 Add `.clear-completed` button styles (no background/border, muted color, cursor pointer)
- [ ] 3.3 Add `.clear-completed:hover` style (red accent on hover)

## 4. DOM Layer — Handler and Visibility

- [ ] 4.1 Implement `handleClearCompleted()` in `app.js` SECTION 3: `tasks = clearCompleted(tasks)`, `saveTasks(tasks)`, `render(tasks)`
- [ ] 4.2 Add visibility toggle in `render()`: `tasks.some(t => t.completed)` → show/hide `.clear-completed` button
- [ ] 4.3 Wire click listener on `.clear-completed` in `init()`

## 5. Full Test Suite — Green Confirmation

- [ ] 5.1 Run `node --test test/*.test.js` and confirm all tests pass (Green)
- [ ] 5.2 Refactor if needed — re-run tests, confirm still Green

## 6. Manual Verification — Acceptance Criteria

- [ ] 6.1 Open `https://fabianedl777.github.io/todo-app/` with hard refresh
- [ ] 6.2 Create 3 tasks, complete 2 → "Clear completed" button appears
- [ ] 6.3 Click "Clear completed" → 2 completed tasks removed, 1 remains, counter shows "1 item left"
- [ ] 6.4 Button hides after clear (no completed tasks left)
- [ ] 6.5 Complete all tasks → click "Clear completed" → list empty, counter "0 items left"
- [ ] 6.6 No completed tasks → button not visible
- [ ] 6.7 Reload after clear → completed tasks stay gone (persisted)
- [ ] 6.8 Clear while "Completed" filter active → list empties, switch to "All" shows remaining active tasks