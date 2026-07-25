# Tasks: Task Core — CRUD + Persistence

## 1. Project Scaffolding

- [x] 1.1 Create `index.html` with semantic structure (`<main class="app">`, `<h1>TODO</h1>`, `<input id="new-task-input">`, `<ul id="todo-list">`, `<link rel="stylesheet" href="styles.css">`, `<script src="app.js">`)
- [x] 1.2 Create `styles.css` with minimal styling (reset, flex layout, `.todo-item` border/padding, `.todo-item--completed .todo__text` strikethrough, `.todo__delete` hover-only opacity, `#new-task-input` full-width, `.todo__edit-input` inline edit style)
- [x] 1.3 Create `app.js` with section comment banners (SECTION 1: Pure Functions, SECTION 2: Storage, SECTION 3: DOM Layer) and `module.exports` guard exporting `createTask`, `toggleTask`, `deleteTask`, `editTask`, `saveTasks`, `loadTasks`
- [x] 1.4 Create `test/helpers.js` with `MockStorage` class (in-memory `getItem`/`setItem`/`removeItem`), `stubUUID()` function (counter-based deterministic UUID with restore), `makeTasks(n)` factory, and `module.exports`
- [x] 1.5 Create `test/task.test.js` skeleton with `require('node:test')`, `require('node:assert/strict')`, `require('../app.js')` destructuring, `require('./helpers')`, and `describe` blocks for `createTask`, `toggleTask`, `deleteTask`, `editTask`, and `Immutability invariant`
- [x] 1.6 Create `test/storage.test.js` skeleton with `require('node:test')`, `require('node:assert/strict')`, `require('../app.js')` destructuring, `require('./helpers')`, and `describe` blocks for `saveTasks`, `loadTasks`, and `Round-trip`

## 2. Test Infrastructure Verification

- [x] 2.1 Run `node --test test/` and confirm both test files are discovered and all tests fail (no implementations yet — Red phase baseline)

## 3. Data Persistence — TDD: saveTasks

- [x] 3.1 Write test: `saveTasks` writes JSON to localStorage under `todos` key (inject `MockStorage` as `global.localStorage`, call `saveTasks(makeTasks(2))`, assert `storage.data['todos']` equals `JSON.stringify(makeTasks(2))`)
- [x] 3.2 Write test: `saveTasks` writes `'[]'` for empty array (call `saveTasks([])`, assert stored value is `'[]'`)
- [x] 3.3 Write test: `saveTasks` swallows `QuotaExceededError` (MockStorage `setItem` throws, assert no exception propagates)
- [x] 3.4 Write test: `saveTasks` swallows generic storage error (MockStorage `setItem` throws generic Error, assert no exception propagates)
- [x] 3.5 Implement `saveTasks(tasks)` in `app.js` SECTION 2: `try { localStorage.setItem('todos', JSON.stringify(tasks)) } catch (e) {}` — run tests, confirm Green

## 4. Data Persistence — TDD: loadTasks

- [x] 4.1 Write test: `loadTasks` returns parsed array from valid JSON (set `storage.data['todos']` to JSON string of 2 tasks, call `loadTasks()`, `assert.deepStrictEqual` result)
- [x] 4.2 Write test: `loadTasks` returns `[]` when key is missing (`getItem('todos')` returns `null`, assert result is `[]`)
- [x] 4.3 Write test: `loadTasks` returns `[]` on invalid JSON (set `todos` to `"not valid json"`, assert `[]`, no throw)
- [x] 4.4 Write test: `loadTasks` returns `[]` when storage throws (MockStorage `getItem` throws, assert `[]`, no throw)
- [x] 4.5 Write test: `loadTasks` returns `[]` when parsed value is not an array (set `todos` to `"{}"`, assert `[]`)
- [x] 4.6 Write test: Round-trip — `saveTasks` then `loadTasks` returns identical data (save 2 tasks, load, `assert.deepStrictEqual` all fields preserved)
- [x] 4.7 Implement `loadTasks()` in `app.js` SECTION 2: `try` block with `getItem` → null check → `JSON.parse` → `Array.isArray` guard → return array; `catch` returns `[]` — run tests, confirm Green

## 5. Task CRUD Pure Functions — TDD: createTask

- [x] 5.1 Write test: `createTask` adds task at index 0 with correct fields (`id` string, `text` = input, `completed` = false, `createdAt` ISO string) — use `stubUUID` for deterministic id
- [x] 5.2 Write test: `createTask` with empty string `""` returns the same array reference unchanged
- [x] 5.3 Write test: `createTask` with whitespace-only text `"   "` returns array unchanged (trimmed to empty)
- [x] 5.4 Write test: `createTask` trims surrounding whitespace (`"  Buy milk  "` → `text` = `"Buy milk"`)
- [x] 5.5 Write test: `createTask` generates unique id different from existing task ids (stub UUID counter)
- [x] 5.6 Write test: `createTask` does not mutate input array (clone before call, `assert.deepStrictEqual` original unchanged, `assert.notStrictEqual` result, input)
- [x] 5.7 Write test: `createTask` prepends new task (result length = input length + 1, new task at index 0)
- [x] 5.8 Implement `generateId()` and `createTask(tasks, text)` in `app.js` SECTION 1

## 6. Task CRUD Pure Functions — TDD: toggleTask

- [x] 6.1 Write test: `toggleTask` flips `completed` false → true for matching id
- [x] 6.2 Write test: `toggleTask` flips `completed` true → false for matching id
- [x] 6.3 Write test: `toggleTask` toggling one task does not affect others (2 tasks, toggle t1, assert t2 unchanged)
- [x] 6.4 Write test: `toggleTask` with non-existent id returns new array with all tasks unchanged
- [x] 6.5 Write test: `toggleTask` on empty array returns empty array
- [x] 6.6 Write test: `toggleTask` does not mutate input array (`assert.notStrictEqual` result, input; input unchanged)
- [x] 6.7 Implement `toggleTask(tasks, id)` in `app.js` SECTION 1 using `.map()` with spread

## 7. Task CRUD Pure Functions — TDD: deleteTask

- [x] 7.1 Write test: `deleteTask` removes matching id (2 tasks, delete t1, result has only t2)
- [x] 7.2 Write test: `deleteTask` removing one task does not affect others (assert remaining task fields unchanged)
- [x] 7.3 Write test: `deleteTask` with non-existent id returns new array with all tasks unchanged
- [x] 7.4 Write test: `deleteTask` on empty array returns empty array
- [x] 7.5 Write test: `deleteTask` does not mutate input array
- [x] 7.6 Implement `deleteTask(tasks, id)` in `app.js` SECTION 1 using `.filter()`

## 8. Task CRUD Pure Functions — TDD: editTask

- [x] 8.1 Write test: `editTask` updates text for matching id (task text changes, other fields unchanged)
- [x] 8.2 Write test: `editTask` trims surrounding whitespace (`"  New text  "` → `"New text"`)
- [x] 8.3 Write test: `editTask` with empty text after trim leaves task text unchanged
- [x] 8.4 Write test: `editTask` with non-existent id returns new array with all tasks unchanged
- [x] 8.5 Write test: `editTask` on empty array returns empty array
- [x] 8.6 Write test: `editTask` does not mutate input array
- [x] 8.7 Write test: `editTask` editing one task does not affect others
- [x] 8.8 Implement `editTask(tasks, id, newText)` in `app.js` SECTION 1 using `.map()` with trim + empty guard

## 9. Immutability Invariant — TDD

- [x] 9.1 Write test: all four pure functions (`createTask`, `toggleTask`, `deleteTask`, `editTask`) return a different array reference than the input (`assert.notStrictEqual` for each)
- [x] 9.2 Write test: all four pure functions do not mutate the input array (deep-compare original before/after)
- [x] 9.3 Run full test suite (`node --test test/`), confirm all tests Green — Refactor if needed, re-run to confirm still Green

## 10. DOM Layer — HTML Structure

- [x] 10.1 Fill `index.html` with semantic structure per design §3.1
- [x] 10.2 Fill `styles.css` with all styles per design §4.2

## 11. DOM Layer — render() Function

- [x] 11.1 Implement `render(tasks)` in `app.js` SECTION 3

## 12. DOM Layer — Event Wiring: Create

- [x] 12.1 Implement `handleCreate()` in `app.js` SECTION 3
- [x] 12.2 Wire keydown listener on `#new-task-input` for Enter key → `handleCreate()` (inside `init()`)

## 13. DOM Layer — Event Wiring: Toggle Complete

- [x] 13.1 Implement `handleListClick(e)` in `app.js` SECTION 3: find `e.target.closest('.todo-item')`, extract `li.dataset.id`, if `e.target.classList.contains('todo__checkbox')` → `tasks = toggleTask(tasks, id)`, `saveTasks`, `render`
- [x] 13.2 Wire click listener on `#todo-list` → `handleListClick` (inside `init()`)

## 14. DOM Layer — Event Wiring: Delete

- [x] 14.1 Extend `handleListClick(e)`: if `e.target.classList.contains('todo__delete')` → `tasks = deleteTask(tasks, id)`, `saveTasks`, `render` (same listener wired in step 13.2)

## 15. DOM Layer — Event Wiring: Edit Inline

- [x] 15.1 Implement `handleListDblClick(e)` in `app.js` SECTION 3
- [x] 15.2 Implement `enterEditMode(li, task)`
- [x] 15.3 Implement `commitEdit(li, task, input)`
- [x] 15.4 Implement `cancelEdit(li, task)`
- [x] 15.5 Wire dblclick listener on `#todo-list` → `handleListDblClick` (inside `init()`)

## 16. Integration — Load on Startup

- [x] 16.1 Implement `init()` in `app.js` SECTION 3
- [x] 16.2 Add `document.addEventListener('DOMContentLoaded', init)` at end of `app.js`
- [x] 16.3 Verify `module.exports` guard is after SECTION 2 (pure + storage functions exported) and before SECTION 3 (DOM layer not exported)

## 17. Full Test Suite — Green Confirmation

- [x] 17.1 Run `node --test test/` and confirm all tests pass (Green) — no regressions from DOM layer additions
- [x] 17.2 Refactor: review `app.js` for section clarity, remove dead code, ensure no function is exported that shouldn't be — re-run tests, confirm still Green

## 18. Manual Verification — Acceptance Criteria

- [x] 18.1 Open `index.html` in browser
- [x] 18.2 Create task: type "Buy milk", press Enter
- [x] 18.3 Create second task: type "Walk dog", press Enter
- [x] 18.4 Complete task: click checkbox on "Walk dog"
- [x] 18.5 Toggle back: click checkbox again
- [x] 18.6 Delete task: hover over a task, click ×
- [x] 18.7 Edit task: double-click task text
- [x] 18.8 Save edit with Enter: change text, press Enter
- [x] 18.9 Save edit with blur: double-click, change text, click elsewhere
- [x] 18.10 Cancel edit with Escape: double-click, change text, press Escape
- [x] 18.11 Edit to empty: double-click, clear input, press Enter
- [x] 18.12 Whitespace trim: type "  Buy bread  ", press Enter
- [x] 18.13 Persistence: create 3 tasks, complete 1, reload page
- [x] 18.14 Empty input: press Enter with empty input
- [x] 18.15 Whitespace-only input: type spaces, press Enter
- [x] 18.16 Verify all acceptance criteria from PRD section 7 are met