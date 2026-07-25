# Spec: Task Counter

Requirements and scenarios for the active task counter.

---

## Requirements

### REQ-TC-001: Active Task Counter

The app SHALL display a counter showing the number of active (non-completed) tasks below the task list.

- Counter text format: "X items left" (plural) or "1 item left" (singular).
- Counter reflects ALL tasks, not just the filtered subset. If filter is "Completed" and there are 3 active tasks, the counter still shows "3 items left".
- Counter updates immediately after every mutation (create, toggle, delete, edit).
- Counter is visible at all times, even when the task list is empty ("0 items left").

### REQ-TC-002: Pure Function countActive

The app SHALL provide a pure function `countActive(tasks)` that returns the number of non-completed tasks.

- Input: tasks array.
- Output: integer >= 0.
- Does not mutate the input array.
- Does not depend on any external state.

---

## Scenarios

### Counter Display

#### Scenario: Multiple active tasks

- **GIVEN** 3 tasks exist, 1 completed
- **WHEN** the page renders
- **THEN** the counter shows "2 items left"

#### Scenario: All tasks completed

- **GIVEN** 3 tasks exist, all completed
- **WHEN** the page renders
- **THEN** the counter shows "0 items left"

#### Scenario: No tasks

- **GIVEN** the tasks array is empty
- **WHEN** the page renders
- **THEN** the counter shows "0 items left"

#### Scenario: Exactly one active task

- **GIVEN** 1 task exists, not completed
- **WHEN** the page renders
- **THEN** the counter shows "1 item left" (singular)

#### Scenario: Counter ignores filter

- **GIVEN** 3 active tasks and 2 completed tasks, filter is "Completed"
- **WHEN** the page renders
- **THEN** the counter shows "3 items left" (counts all active, not just visible)

#### Scenario: Counter updates on create

- **GIVEN** 1 active task, counter shows "1 item left"
- **WHEN** the user creates a new task
- **THEN** the counter updates to "2 items left" immediately

#### Scenario: Counter updates on toggle

- **GIVEN** 2 active tasks, counter shows "2 items left"
- **WHEN** the user completes one task
- **THEN** the counter updates to "1 item left" immediately

#### Scenario: Counter updates on delete

- **GIVEN** 2 active tasks, counter shows "2 items left"
- **WHEN** the user deletes one active task
- **THEN** the counter updates to "1 item left" immediately