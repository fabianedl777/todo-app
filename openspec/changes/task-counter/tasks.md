# Tasks: Task Counter — Active Tasks Count

## 1. TDD: countActive Pure Function

- [ ] 1.1 Add `countActive` to `require('../app.js')` destructuring in `test/task.test.js`
- [ ] 1.2 Write test: `countActive` returns 0 for empty array
- [ ] 1.3 Write test: `countActive` returns count of non-completed tasks (3 active, 2 completed → 3)
- [ ] 1.4 Write test: `countActive` returns 0 when all tasks are completed
- [ ] 1.5 Write test: `countActive` returns full length when none are completed
- [ ] 1.6 Write test: `countActive` returns 1 for single active task
- [ ] 1.7 Write test: `countActive` does not mutate input array
- [ ] 1.8 Implement `countActive(tasks)` in `app.js` SECTION 1: `return tasks.filter(t => !t.completed).length` — run tests, confirm Green
- [ ] 1.9 Add `countActive` to `module.exports` guard in `app.js`

## 2. DOM Layer — Footer HTML

- [ ] 2.1 Add `<footer class="app-footer"><span class="task-count">0 items left</span></footer>` to `index.html` after `#todo-list`, inside `<main class="app">`

## 3. DOM Layer — Footer CSS

- [ ] 3.1 Add `.app-footer` styles to `styles.css` (margin-top, padding, small font-size, muted color)
- [ ] 3.2 Add `.task-count` styles if needed (likely inherits from footer)

## 4. DOM Layer — Counter Update

- [ ] 4.1 Implement `updateTaskCount(tasks)` in `app.js` SECTION 3: query `.task-count`, set textContent to `count + (count === 1 ? ' item left' : ' items left')`
- [ ] 4.2 Add `updateTaskCount(tasks)` call at end of `render()` — uses full `tasks` array, not filtered subset

## 5. Full Test Suite — Green Confirmation

- [ ] 5.1 Run `node --test test/*.test.js` and confirm all tests pass (Green)
- [ ] 5.2 Refactor if needed — re-run tests, confirm still Green

## 6. Manual Verification — Acceptance Criteria

- [ ] 6.1 Open `https://fabianedl777.github.io/todo-app/` with hard refresh
- [ ] 6.2 Empty list → counter shows "0 items left"
- [ ] 6.3 Create 3 tasks → counter shows "3 items left"
- [ ] 6.4 Complete 1 task → counter shows "2 items left"
- [ ] 6.5 Delete 1 active task → counter shows "1 item left" (singular)
- [ ] 6.6 Complete all tasks → counter shows "0 items left"
- [ ] 6.7 Switch to "Completed" filter with 2 active tasks → counter still shows "2 items left" (ignores filter)
- [ ] 6.8 Reload page → counter reflects persisted state correctly