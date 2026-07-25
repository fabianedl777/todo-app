# Tasks: Task Filters — All / Active / Completed

## 1. TDD: filterTasks Pure Function

- [ ] 1.1 Add `filterTasks` to `require('../app.js')` destructuring in `test/task.test.js`
- [ ] 1.2 Write test: `filterTasks` with `'all'` returns all tasks (new reference, input unchanged)
- [ ] 1.3 Write test: `filterTasks` with `'active'` returns only non-completed tasks
- [ ] 1.4 Write test: `filterTasks` with `'completed'` returns only completed tasks
- [ ] 1.5 Write test: `filterTasks` with empty array returns empty array for all three filters
- [ ] 1.6 Write test: `filterTasks` with invalid filter value (`'banana'`) defaults to `'all'` (returns all tasks)
- [ ] 1.7 Write test: `filterTasks` does not mutate input array (`assert.notStrictEqual` result, input; `assert.deepStrictEqual` input unchanged)
- [ ] 1.8 Write test: `filterTasks` returns new array reference for all filters (immutability invariant)
- [ ] 1.9 Implement `filterTasks(tasks, filter)` in `app.js` SECTION 1: `'active'` → `.filter(t => !t.completed)`, `'completed'` → `.filter(t => t.completed)`, default → `[...tasks]` — run tests, confirm Green

## 2. Filter Persistence — Storage Functions

- [ ] 2.1 Implement `saveFilter(filter)` in `app.js` SECTION 2: `try { localStorage.setItem('filter', filter) } catch (e) {}`
- [ ] 2.2 Implement `loadFilter()` in `app.js` SECTION 2: `try` block with `getItem('filter')` → validate against `'all'`, `'active'`, `'completed'` → return value or `'all'`; `catch` returns `'all'`
- [ ] 2.3 Add `filterTasks`, `saveFilter`, `loadFilter` to `module.exports` guard in `app.js`

## 3. Export Verification

- [ ] 3.1 Run `node --test test/*.test.js` and confirm all tests pass (Green) — `filterTasks` exported and tested, storage functions not tested but exported

## 4. DOM Layer — Filter Bar HTML

- [ ] 4.1 Add `<div class="filters">` with three `<button class="filter-btn">` elements (All, Active, Completed) to `index.html` between `#new-task-input` and `#todo-list`. "All" button starts with `filter-btn--active` class.

## 5. DOM Layer — Filter Bar CSS

- [ ] 5.1 Add `.filters` flex container styles to `styles.css` (flex, gap, margin-bottom)
- [ ] 5.2 Add `.filter-btn` base styles (padding, font-size, border, border-radius pill, background transparent, color, cursor, transition)
- [ ] 5.3 Add `.filter-btn:hover` styles (border-color accent, color accent)
- [ ] 5.4 Add `.filter-btn--active` styles (background accent, border accent, color white)
- [ ] 5.5 Add `.filter-btn--active:hover` override (keep color white)

## 6. DOM Layer — Filter State and Rendering

- [ ] 6.1 Add `let currentFilter = 'all'` module-scoped variable in `app.js` SECTION 3
- [ ] 6.2 Implement `updateFilterButtons()` in `app.js` SECTION 3: query all `.filter-btn`, toggle `filter-btn--active` class based on `btn.dataset.filter === currentFilter`
- [ ] 6.3 Update `render(tasks)` in `app.js` SECTION 3: call `filterTasks(tasks, currentFilter)` before building DOM list
- [ ] 6.4 Implement `handleFilterClick(e)` in `app.js` SECTION 3: `e.target.closest('.filter-btn')` → extract `dataset.filter` → set `currentFilter` → `saveFilter` → `updateFilterButtons` → `render`

## 7. DOM Layer — Event Wiring

- [ ] 7.1 Update `init()` in `app.js` SECTION 3: add `currentFilter = loadFilter()` after `tasks = loadTasks()`, add `updateFilterButtons()` call, add click listener on `.filters` container → `handleFilterClick`
- [ ] 7.2 Verify `init()` guard still handles both `loading` and `complete` readyState (existing fix from task-core)

## 8. Full Test Suite — Green Confirmation

- [ ] 8.1 Run `node --test test/*.test.js` and confirm all tests pass (Green) — no regressions from DOM layer additions
- [ ] 8.2 Refactor: review `app.js` for section clarity, remove dead code — re-run tests, confirm still Green

## 9. Manual Verification — Acceptance Criteria

- [ ] 9.1 Open `https://fabianedl777.github.io/todo-app/` in browser
- [ ] 9.2 Create 3 tasks: "Task A", "Task B", "Task C"
- [ ] 9.3 Complete "Task C" (click checkbox)
- [ ] 9.4 Click "Active" filter → only "Task A" and "Task B" visible
- [ ] 9.5 Click "Completed" filter → only "Task C" visible
- [ ] 9.6 Click "All" filter → all 3 tasks visible
- [ ] 9.7 With "Active" filter selected, complete "Task A" → "Task A" disappears from list immediately
- [ ] 9.8 Switch to "Completed" → "Task A" and "Task C" visible
- [ ] 9.9 Reload page → filter selection persists (e.g., if "Completed" was selected, it remains selected)
- [ ] 9.10 Verify filter bar is visible when list is empty (delete all tasks, filter bar still shows)
- [ ] 9.11 Verify "All" is highlighted by default on first visit (clear localStorage)