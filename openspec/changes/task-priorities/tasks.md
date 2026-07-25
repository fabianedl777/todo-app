# Tasks: Task Priorities — Alta/Media/Baja with Color Coding

## 1. TDD: setPriority Pure Function

- [ ] 1.1 Add `setPriority` to `require('../app.js')` destructuring in `test/task.test.js`
- [ ] 1.2 Write test: `setPriority` updates priority for matching id (`'medium'` → `'high'`)
- [ ] 1.3 Write test: `setPriority` with invalid priority returns new array unchanged
- [ ] 1.4 Write test: `setPriority` with non-existent id returns new array unchanged
- [ ] 1.5 Write test: `setPriority` does not mutate input array
- [ ] 1.6 Write test: `setPriority` returns new array reference
- [ ] 1.7 Write test: `createTask` new task has `priority: 'medium'` by default
- [ ] 1.8 Implement `setPriority(tasks, id, priority)` in `app.js` SECTION 1 — run tests, confirm Green
- [ ] 1.9 Add `priority: 'medium'` to `createTask` return object
- [ ] 1.10 Add `setPriority` to `module.exports`

## 2. DOM Layer — Priority Dot in render()

- [ ] 2.1 In `render()`, create `<span class="todo__priority todo__priority--{priority}">●</span>` with `dataset.id` for each task
- [ ] 2.2 Insert priority dot before checkbox in `li.append()`
- [ ] 2.3 Use `task.priority || 'medium'` for backward compatibility with existing tasks

## 3. DOM Layer — CSS

- [ ] 3.1 Add `.todo__priority` base styles (flex-shrink, cursor pointer, small font, user-select none)
- [ ] 3.2 Add `.todo__priority--high` color (`var(--danger)`)
- [ ] 3.3 Add `.todo__priority--medium` color (`var(--muted)`)
- [ ] 3.4 Add `.todo__priority--low` color (`var(--accent)`)

## 4. DOM Layer — Click to Cycle

- [ ] 4.1 In `handleListClick`, add check for `.todo__priority` — find task, cycle `medium → high → low → medium`, call `setPriority`, save, render

## 5. Full Test Suite — Green Confirmation

- [ ] 5.1 Run `node --test test/*.test.js` and confirm all tests pass (Green)

## 6. Manual Verification

- [ ] 6.1 Open app with hard refresh — new tasks have gray dot (medium)
- [ ] 6.2 Click dot → turns red (high)
- [ ] 6.3 Click dot → turns blue (low)
- [ ] 6.4 Click dot → turns gray (medium) again
- [ ] 6.5 Reload → priorities persist
- [ ] 6.6 Priority dot works in both light and dark mode