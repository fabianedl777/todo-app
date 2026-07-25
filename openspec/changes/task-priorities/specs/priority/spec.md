# Spec: Task Priorities

---

## Requirements

### REQ-PR-001: Priority Field

Each task SHALL have a `priority` field with value `'high'`, `'medium'`, or `'low'`.

- New tasks default to `'medium'`.
- Priority is persisted as part of the task object in localStorage.
- Existing tasks without a `priority` field are treated as `'medium'`.

### REQ-PR-002: setPriority Pure Function

The app SHALL provide `setPriority(tasks, id, priority)` that returns a new array with the matching task's priority updated.

- Valid priorities: `'high'`, `'medium'`, `'low'`.
- Invalid priority → returns new array unchanged (no mutation).
- Non-existent id → returns new array unchanged.
- Does not mutate input array.
- Returns new array reference.

### REQ-PR-003: Visual Indicator

Each task item SHALL display a priority dot that shows the current priority with color:

- High: red dot (`var(--danger)`)
- Medium: gray dot (`var(--muted)`)
- Low: blue dot (`var(--accent)`)

### REQ-PR-004: Click to Cycle

Clicking the priority dot cycles: `medium → high → low → medium`.

- Calls `setPriority`, saves, re-renders.
- Handled via existing event delegation on `#todo-list`.