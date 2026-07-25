# Spec: Clear Completed

Requirements and scenarios for bulk-deleting completed tasks.

---

## Requirements

### REQ-CC-001: Clear Completed Button

The app SHALL display a "Clear completed" button in the footer, to the right of the task counter.

- Button text: "Clear completed".
- Button is only visible when at least one completed task exists.
- Button is hidden when zero tasks are completed (no completed tasks to clear).
- Clicking the button removes ALL completed tasks from the tasks array.
- After clearing, the new state is persisted to localStorage and the list re-renders.

### REQ-CC-002: Pure Function clearCompleted

The app SHALL provide a pure function `clearCompleted(tasks)` that returns a new array containing only non-completed tasks.

- Input: tasks array.
- Output: new array with only tasks where `completed === false`.
- Does not mutate the input array.
- Returns a new array reference in all cases (even when no tasks are removed).

### REQ-CC-003: Post-Clear State

After clearing completed tasks:

- The tasks array contains only active tasks.
- The task counter updates to reflect the new count.
- The "Clear completed" button hides (no completed tasks remain).
- If the active filter is "Completed", the list shows empty state (no completed tasks to show).
- If the active filter is "All" or "Active", the list shows remaining active tasks.

---

## Scenarios

### Clear Completed Button

#### Scenario: Button hidden when no completed tasks

- **GIVEN** 3 tasks exist, all active (none completed)
- **WHEN** the page renders
- **THEN** the "Clear completed" button is not visible

#### Scenario: Button visible when completed tasks exist

- **GIVEN** 3 tasks exist, 1 completed
- **WHEN** the page renders
- **THEN** the "Clear completed" button is visible

#### Scenario: Clear removes all completed tasks

- **GIVEN** 5 tasks exist: 3 active, 2 completed
- **WHEN** the user clicks "Clear completed"
- **THEN** the 2 completed tasks are removed from the array
- **AND** the tasks array now contains only the 3 active tasks
- **AND** localStorage is updated with the new state
- **AND** the list re-renders showing 3 tasks
- **AND** the counter shows "3 items left"
- **AND** the "Clear completed" button hides

#### Scenario: Clear with all tasks completed

- **GIVEN** 3 tasks exist, all completed
- **WHEN** the user clicks "Clear completed"
- **THEN** all 3 tasks are removed
- **AND** the tasks array is empty
- **AND** localStorage is updated with empty array
- **AND** the list is empty
- **AND** the counter shows "0 items left"
- **AND** the "Clear completed" button hides

#### Scenario: Clear with no completed tasks (no-op)

- **GIVEN** 3 tasks exist, 0 completed
- **WHEN** the user clicks "Clear completed" (if button were somehow clickable)
- **THEN** no tasks are removed (array unchanged in content, new reference returned)
- **AND** the list still shows 3 tasks

#### Scenario: Clear persists across reload

- **GIVEN** 5 tasks (3 active, 2 completed), user clicks "Clear completed"
- **WHEN** the page is reloaded
- **THEN** only the 3 active tasks are restored from localStorage
- **AND** the 2 completed tasks are gone permanently

#### Scenario: Clear while Completed filter is active

- **GIVEN** 5 tasks (3 active, 2 completed), filter is "Completed" showing 2 tasks
- **WHEN** the user clicks "Clear completed"
- **THEN** the 2 completed tasks are removed
- **AND** the list shows 0 tasks (empty, because filter is still "Completed")
- **AND** switching to "All" shows the 3 remaining active tasks