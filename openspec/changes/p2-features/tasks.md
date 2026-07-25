# Tasks: P2 Features — Priority Filters, Creation Date, Animations, Export/Import

## 1. TDD: Pure Functions

- [ ] 1.1 Add `filterByPriority`, `formatRelativeTime`, `importTasks` to `require` in `test/task.test.js`
- [ ] 1.2 Write tests for `filterByPriority` (all/high/medium/low/empty/no-mutate/new-ref)
- [ ] 1.3 Write tests for `formatRelativeTime` (just now/m/h/d/date/invalid)
- [ ] 1.4 Write tests for `importTasks` (merge/dedupe/invalid/empty/no-mutate)
- [ ] 1.5 Implement `filterByPriority`, `formatRelativeTime`, `importTasks` in `app.js` SECTION 1
- [ ] 1.6 Add to `module.exports`
- [ ] 1.7 Run tests, confirm Green

## 2. Priority Filters — DOM Layer

- [ ] 2.1 Add second filter row HTML (All/High/Medium/Low) to `index.html`
- [ ] 2.2 Add `currentPriorityFilter` state + `savePriorityFilter`/`loadPriorityFilter` storage functions
- [ ] 2.3 Implement `handlePriorityFilterClick` + `updatePriorityFilterButtons`
- [ ] 2.4 Update `render()` to apply both `filterTasks` AND `filterByPriority`
- [ ] 2.5 Wire listener in `init()`, restore saved filter
- [ ] 2.6 Add CSS for second filter row

## 3. Creation Date — DOM Layer

- [ ] 3.1 Add `<span class="todo__date">` to each task item in `render()`
- [ ] 3.2 Add `.todo__date` CSS (small font, muted, nowrap)

## 4. Animations

- [ ] 4.1 Add `@keyframes slideOut` and `@keyframes completePulse` to CSS
- [ ] 4.2 Add delete animation: `todo-item--removing` class + 200ms timeout before render
- [ ] 4.3 Add complete animation: `todo-item--completing` class
- [ ] 4.4 Add `.todo-item--removing` and `.todo-item--completing` CSS classes

## 5. Export/Import JSON

- [ ] 5.1 Add Export/Import buttons + hidden file input to footer in `index.html`
- [ ] 5.2 Implement `handleExport()` — create JSON blob, download
- [ ] 5.3 Implement `handleImport(e)` — read file, parse, `importTasks`, save, render
- [ ] 5.4 Wire listeners in `init()`
- [ ] 5.5 Add `.export-btn` and `.import-btn` CSS

## 6. Full Test Suite — Green

- [ ] 6.1 Run `node --test test/*.test.js`, confirm all green
- [ ] 6.2 Commit and push

## 7. Manual Verification

- [ ] 7.1 Priority filters work (All/High/Medium/Low)
- [ ] 7.2 Creation date shows relative time
- [ ] 7.3 Delete animation plays
- [ ] 7.4 Export downloads JSON file
- [ ] 7.5 Import merges tasks correctly
- [ ] 7.6 All works in light and dark mode