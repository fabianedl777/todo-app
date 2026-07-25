# Spec: Task Filters

Requirements and scenarios for filtering tasks by completion status.

---

## Requirements

### REQ-FI-001: Filter Bar UI

The app SHALL display a filter bar with three buttons between the input and the task list.

- Three buttons: "All", "Active", "Completed".
- The currently active filter button SHALL have a visual highlight (distinct background/color).
- The filter bar SHALL be visible at all times, even when the task list is empty.
- Clicking a filter button switches the active filter immediately.

### REQ-FI-002: Filter Logic

The app SHALL filter tasks by completion status using a pure function `filterTasks(tasks, filter)`.

- `'all'` → returns all tasks (new array reference).
- `'active'` → returns only tasks where `completed === false`.
- `'completed'` → returns only tasks where `completed === true`.
- Invalid or missing filter value defaults to `'all'`.
- The function SHALL NOT mutate the input array.
- The function SHALL return a new array reference in all cases.

### REQ-FI-003: Filter Persistence

The app SHALL persist the current filter selection to `localStorage` under the key `filter`.

- Filter is saved as a plain string: `'all'`, `'active'`, or `'completed'`.
- On page load (`init`), the app SHALL restore the saved filter.
- If the key is missing or contains an invalid value, the app defaults to `'all'`.
- Filter is saved on every filter change (button click).

### REQ-FI-004: Render Integration

The `render` function SHALL display only tasks matching the current filter.

- `render` calls `filterTasks(tasks, currentFilter)` before building the DOM list.
- When filter changes, the list re-renders immediately with the new subset.
- Toggling a task's completion while a filter is active SHALL cause the task to appear or disappear from the view immediately (because render is called after toggle, and the filter excludes non-matching tasks).

---

## Scenarios

### Filter Bar UI

#### Scenario: Default filter is All

- **GIVEN** the app is opened for the first time (no saved filter)
- **WHEN** the page loads
- **THEN** the "All" button is highlighted
- **AND** all tasks (active and completed) are visible in the list

#### Scenario: Switch from All to Active

- **GIVEN** the filter bar shows "All" highlighted and the list contains 3 tasks (2 active, 1 completed)
- **WHEN** the user clicks "Active"
- **THEN** the "Active" button becomes highlighted
- **AND** the "All" button loses its highlight
- **AND** only the 2 active tasks are visible in the list
- **AND** the completed task is no longer visible

#### Scenario: Switch from Active to Completed

- **GIVEN** the filter is "Active" and 2 active tasks are visible
- **WHEN** the user clicks "Completed"
- **THEN** the "Completed" button becomes highlighted
- **AND** only completed tasks are visible in the list
- **AND** the 2 previously active tasks are no longer visible

#### Scenario: Filter bar visible with empty list

- **GIVEN** there are zero tasks in the app
- **WHEN** the page loads
- **THEN** the filter bar is visible with all three buttons
- **AND** "All" is highlighted
- **AND** the task list is empty (no items)

### Filter Logic

#### Scenario: filterTasks returns all tasks for 'all'

- **GIVEN** a tasks array with 3 tasks (2 active, 1 completed)
- **WHEN** `filterTasks(tasks, 'all')` is called
- **THEN** a new array with all 3 tasks is returned
- **AND** the input array is not mutated

#### Scenario: filterTasks returns only active tasks

- **GIVEN** a tasks array with 3 tasks (2 active, 1 completed)
- **WHEN** `filterTasks(tasks, 'active')` is called
- **THEN** a new array with 2 tasks is returned (both with `completed === false`)
- **AND** the input array is not mutated

#### Scenario: filterTasks returns only completed tasks

- **GIVEN** a tasks array with 3 tasks (2 active, 1 completed)
- **WHEN** `filterTasks(tasks, 'completed')` is called
- **THEN** a new array with 1 task is returned (with `completed === true`)
- **AND** the input array is not mutated

#### Scenario: filterTasks with empty array

- **GIVEN** an empty tasks array
- **WHEN** `filterTasks([], 'all')` is called
- **THEN** an empty array is returned

#### Scenario: filterTasks with invalid filter defaults to all

- **GIVEN** a tasks array with 2 tasks
- **WHEN** `filterTasks(tasks, 'invalid')` is called
- **THEN** a new array with all tasks is returned (treated as 'all')

#### Scenario: filterTasks does not mutate input

- **GIVEN** a tasks array with 3 tasks
- **WHEN** `filterTasks(tasks, 'active')` is called
- **THEN** the returned array is a different reference than the input
- **AND** the input array retains all 3 tasks unchanged

### Filter Persistence

#### Scenario: Filter survives page reload

- **GIVEN** the user has selected "Active" as the filter
- **WHEN** the page is reloaded
- **THEN** `localStorage.getItem('filter')` returns `'active'`
- **AND** the "Active" button is highlighted on load
- **AND** only active tasks are visible

#### Scenario: Missing filter key defaults to All

- **GIVEN** localStorage has no `filter` key
- **WHEN** the page loads and `init()` runs
- **THEN** the current filter is set to `'all'`
- **AND** the "All" button is highlighted

#### Scenario: Invalid filter value defaults to All

- **GIVEN** localStorage key `filter` contains `'banana'`
- **WHEN** the page loads and `init()` runs
- **THEN** the current filter is set to `'all'`
- **AND** the "All" button is highlighted

#### Scenario: Filter saved on change

- **GIVEN** the current filter is 'all'
- **WHEN** the user clicks "Completed"
- **THEN** `localStorage.setItem('filter', 'completed')` is called
- **AND** the filter is persisted

### Render Integration

#### Scenario: Task disappears when filter excludes it

- **GIVEN** the filter is "Active" and 2 active tasks are visible
- **WHEN** the user clicks the checkbox on one task (completing it)
- **THEN** that task disappears from the list immediately
- **AND** only 1 active task remains visible

#### Scenario: Task appears when filter includes it

- **GIVEN** the filter is "Completed" and 1 completed task is visible
- **WHEN** the user clicks the checkbox on a completed task (un-completing it)
- **THEN** that task disappears from the "Completed" view
- **AND** the task is now active (visible under "Active" filter)

#### Scenario: All filter shows everything after toggle

- **GIVEN** the filter is "All" and 3 tasks are visible (2 active, 1 completed)
- **WHEN** the user completes one active task
- **THEN** all 3 tasks remain visible
- **AND** the newly completed task shows strikethrough styling