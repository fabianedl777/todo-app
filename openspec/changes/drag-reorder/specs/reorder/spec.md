# Spec: Drag & Drop Reorder

---

## Requirements

### REQ-DD-001: Reorder Tasks via Drag & Drop

The app SHALL allow users to reorder tasks by dragging one task onto another.

- Drag a task item and drop it onto another task item to move it to that position.
- The dragged task is inserted at the target task's position. Other tasks shift accordingly.
- After reorder, the new order is persisted to localStorage.
- Drag & drop is only enabled when both filters are "All" (completion filter = 'all' AND priority filter = 'all'). Reordering with active filters would be confusing.

### REQ-DD-002: reorderTasks Pure Function

The app SHALL provide `reorderTasks(tasks, fromId, toId)` that returns a new array with the task moved.

- `fromId === toId` → returns new array unchanged (new reference).
- `fromId` or `toId` not found → returns new array unchanged.
- Moves the task from its current index to the target task's index. Other items shift.
- Does not mutate the input array.
- Returns a new array reference in all cases.

### REQ-DD-003: Visual Feedback

- Dragged item: reduced opacity (0.4).
- Drop target: top border highlight in accent color.
- Classes cleaned up after drag ends.

---

## Scenarios

### reorderTasks

#### Scenario: Move task from index 2 to index 0

- **GIVEN** tasks: [A, B, C] (ids: t1, t2, t3)
- **WHEN** `reorderTasks(tasks, 't3', 't1')` is called
- **THEN** result is [C, A, B] (t3 moved to position of t1, others shift)

#### Scenario: Move task from index 0 to index 2

- **GIVEN** tasks: [A, B, C] (ids: t1, t2, t3)
- **WHEN** `reorderTasks(tasks, 't1', 't3')` is called
- **THEN** result is [B, C, A]

#### Scenario: Same id returns unchanged (new reference)

- **GIVEN** tasks: [A, B]
- **WHEN** `reorderTasks(tasks, 't1', 't1')` is called
- **THEN** result is [A, B] with a new array reference

#### Scenario: Non-existent fromId returns unchanged

- **GIVEN** tasks: [A, B]
- **WHEN** `reorderTasks(tasks, 'nope', 't2')` is called
- **THEN** result is [A, B] unchanged (new reference)

#### Scenario: Non-existent toId returns unchanged

- **GIVEN** tasks: [A, B]
- **WHEN** `reorderTasks(tasks, 't1', 'nope')` is called
- **THEN** result is [A, B] unchanged (new reference)

#### Scenario: Empty array returns empty

- **GIVEN** empty tasks array
- **WHEN** `reorderTasks([], 't1', 't2')` is called
- **THEN** empty array is returned

#### Scenario: Does not mutate input

- **GIVEN** tasks: [A, B, C]
- **WHEN** `reorderTasks(tasks, 't3', 't1')` is called
- **THEN** input array is still [A, B, C] unchanged

### Drag & Drop UI

#### Scenario: Drag enabled with All filters

- **GIVEN** completion filter = 'all' AND priority filter = 'all'
- **WHEN** tasks render
- **THEN** each task item has `draggable="true"`

#### Scenario: Drag disabled with active filter

- **GIVEN** completion filter = 'active'
- **WHEN** tasks render
- **THEN** task items do NOT have `draggable` attribute

#### Scenario: Drop reorders and persists

- **GIVEN** tasks: [A, B, C], filters both 'all'
- **WHEN** user drags C and drops onto A
- **THEN** tasks array becomes [C, A, B]
- **AND** localStorage is updated
- **AND** list re-renders in new order

#### Scenario: Visual feedback during drag

- **GIVEN** user starts dragging task B
- **THEN** task B has reduced opacity
- **WHEN** user drags over task A
- **THEN** task A shows top border highlight
- **WHEN** user drops or releases
- **THEN** all visual feedback classes are removed