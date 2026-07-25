# Spec: Task Management

Requirements and scenarios for task CRUD operations and pure function logic.

---

## Requirements

### REQ-TM-001: Create Task

The app SHALL allow creating a task by typing text into the input field and pressing Enter.

- New task object contains: `id` (UUID), `text` (trimmed), `completed` (false), `createdAt` (ISO timestamp).
- New task is prepended to the tasks array (index 0).
- Input field is cleared after creation.
- State is persisted to localStorage after creation.

### REQ-TM-002: Complete Task

The app SHALL allow toggling a task's `completed` state by clicking its checkbox.

- Toggling flips `completed` from `false` → `true` or `true` → `false`.
- Visual state updates (strikethrough on completed).
- State is persisted after each toggle.
- Toggling one task does not affect any other task.

### REQ-TM-003: Delete Task

The app SHALL allow deleting a task by clicking its delete button.

- Task is removed from the tasks array.
- Task is removed from the DOM.
- State is persisted after deletion.
- Deleting one task does not affect any other task.

### REQ-TM-004: Edit Task Inline

The app SHALL allow editing a task's text by double-clicking the task text.

- Double-click enters edit mode: text is replaced by an input field containing the current text, focused.
- Pressing Enter saves the edit: text is updated (trimmed), persisted, input replaced by text element.
- Blurring the input also saves the edit (same behavior as Enter).
- Pressing Escape cancels the edit: original text is restored, no localStorage write occurs.
- Editing to empty text (after trim) reverts to the original text; no write occurs.
- Surrounding whitespace is trimmed before saving.
- Editing one task does not affect any other task.

### REQ-TM-005: Pure Functions for CRUD Logic

All task operations SHALL be implemented as pure functions that take a tasks array and return a new array.

- `createTask(tasks, text)` — returns new array with new task at index 0.
- `toggleTask(tasks, id)` — returns new array with toggled `completed` for matching id.
- `deleteTask(tasks, id)` — returns new array without matching id.
- `editTask(tasks, id, newText)` — returns new array with updated text for matching id.
- **Immutability invariant**: all functions return a new array reference; the input array is never mutated.

---

## Scenarios

### Create Task

#### Scenario: Standard creation

- **GIVEN** the tasks array is empty
- **WHEN** the user types "Buy milk" into the input and presses Enter
- **THEN** a new task is created with a unique `id`, `text` = "Buy milk", `completed` = false, and a `createdAt` ISO timestamp
- **AND** the new task is prepended to the tasks array (at index 0)
- **AND** the input field is cleared
- **AND** the tasks array is saved to localStorage

#### Scenario: Empty text

- **GIVEN** the tasks array has zero tasks
- **WHEN** the user presses Enter with an empty input field
- **THEN** no task is created
- **AND** the tasks array remains unchanged (length 0)
- **AND** no write to localStorage occurs

#### Scenario: Whitespace-only text

- **GIVEN** the tasks array has zero tasks
- **WHEN** the user types "   " (spaces only) into the input and presses Enter
- **THEN** the text is trimmed to an empty string
- **AND** no task is created
- **AND** the tasks array remains unchanged
- **AND** no write to localStorage occurs

#### Scenario: Text with surrounding whitespace

- **GIVEN** the tasks array has zero tasks
- **WHEN** the user types "  Buy milk  " into the input and presses Enter
- **THEN** the text is trimmed to "Buy milk" before saving
- **AND** a new task is created with `text` = "Buy milk"
- **AND** the new task is prepended to the tasks array

#### Scenario: Multiple tasks get unique IDs

- **GIVEN** the tasks array already contains one task with id "task-1"
- **WHEN** the user types "Walk dog" and presses Enter
- **THEN** a new task is created with a unique id different from "task-1"
- **AND** the tasks array now has two tasks, each with a distinct id

---

### Complete Task

#### Scenario: Toggle incomplete to complete

- **GIVEN** a task exists with `id` = "t1", `completed` = false
- **WHEN** the user clicks the checkbox for task "t1"
- **THEN** the task's `completed` field becomes true
- **AND** the visual state updates to show strikethrough
- **AND** the tasks array is saved to localStorage

#### Scenario: Toggle complete to incomplete

- **GIVEN** a task exists with `id` = "t1", `completed` = true
- **WHEN** the user clicks the checkbox for task "t1"
- **THEN** the task's `completed` field becomes false
- **AND** the strikethrough styling is removed
- **AND** the tasks array is saved to localStorage

#### Scenario: Toggling one task does not affect others

- **GIVEN** two tasks exist: task A (`id` = "t1", `completed` = false) and task B (`id` = "t2", `completed` = false)
- **WHEN** the user clicks the checkbox for task A
- **THEN** task A's `completed` becomes true
- **AND** task B's `completed` remains false
- **AND** both tasks retain their original ids and text

---

### Delete Task

#### Scenario: Delete existing task

- **GIVEN** the tasks array contains task "t1" and task "t2"
- **WHEN** the user clicks the delete button for task "t1"
- **THEN** task "t1" is removed from the tasks array
- **AND** task "t1" is removed from the DOM
- **AND** the tasks array is saved to localStorage
- **AND** the tasks array now contains only task "t2"

#### Scenario: Delete one task does not affect others

- **GIVEN** tasks "t1" and "t2" both exist in the array
- **WHEN** the user deletes task "t1"
- **THEN** task "t2" remains in the array with its original `id`, `text`, `completed`, and `createdAt` values unchanged

#### Scenario: Delete from empty list

- **GIVEN** the tasks array is empty
- **WHEN** the user clicks delete (or a delete action is triggered)
- **THEN** no error is thrown
- **AND** the tasks array remains empty

---

### Edit Task Inline

#### Scenario: Enter edit mode

- **GIVEN** a task exists with `id` = "t1" and `text` = "Buy milk"
- **WHEN** the user double-clicks the task text
- **THEN** the text element is replaced by an input field
- **AND** the input field contains the current text "Buy milk"
- **AND** the input field is focused

#### Scenario: Save edit with Enter

- **GIVEN** a task is in edit mode showing "Buy milk" in the input field
- **WHEN** the user changes the text to "Buy oat milk" and presses Enter
- **THEN** the task's `text` is updated to "Buy oat milk" (trimmed)
- **AND** the input field is replaced by the text element showing "Buy oat milk"
- **AND** the tasks array is saved to localStorage

#### Scenario: Save edit with blur

- **GIVEN** a task is in edit mode showing "Buy milk" in the input field
- **WHEN** the user changes the text to "Buy oat milk" and clicks elsewhere (blur)
- **THEN** the task's `text` is updated to "Buy oat milk" (trimmed)
- **AND** the input field is replaced by the text element
- **AND** the tasks array is saved to localStorage

#### Scenario: Cancel edit with Escape

- **GIVEN** a task is in edit mode with original text "Buy milk", input now shows "Buy oat milk"
- **WHEN** the user presses Escape
- **THEN** the original text "Buy milk" is restored
- **AND** the input field is replaced by the text element showing "Buy milk"
- **AND** no write to localStorage occurs

#### Scenario: Edit to empty text

- **GIVEN** a task is in edit mode with original text "Buy milk"
- **WHEN** the user clears the input and presses Enter
- **THEN** the trimmed text is empty
- **AND** the original text "Buy milk" is restored
- **AND** no write to localStorage occurs

#### Scenario: Edit trims surrounding whitespace

- **GIVEN** a task is in edit mode with original text "Buy milk"
- **WHEN** the user types "  Buy bread  " and presses Enter
- **THEN** the task's `text` is updated to "Buy bread" (whitespace trimmed)
- **AND** the tasks array is saved to localStorage

#### Scenario: Editing one task does not affect others

- **GIVEN** task A (`id` = "t1", `text` = "Alpha") and task B (`id` = "t2", `text` = "Beta") both exist
- **WHEN** the user edits task A's text to "Alpha Updated" and saves
- **THEN** task A's `text` becomes "Alpha Updated"
- **AND** task B's `text` remains "Beta" unchanged
- **AND** both tasks retain their original `id`, `completed`, and `createdAt` values

---

### Pure Functions

#### Scenario: createTask adds task to front of array

- **GIVEN** a tasks array with 1 existing task
- **WHEN** `createTask(tasks, "New item")` is called
- **THEN** a new array is returned with 2 tasks
- **AND** the new task is at index 0
- **AND** the new task has fields: `id` (string), `text` = "New item", `completed` = false, `createdAt` (ISO string)
- **AND** the input array is not mutated

#### Scenario: createTask with empty text returns unchanged array

- **GIVEN** a tasks array with 1 task
- **WHEN** `createTask(tasks, "")` is called
- **THEN** the same array reference is returned unchanged
- **AND** no new task is added

#### Scenario: createTask with whitespace-only text returns unchanged array

- **GIVEN** a tasks array with 1 task
- **WHEN** `createTask(tasks, "   ")` is called
- **THEN** the array is returned unchanged (whitespace trimmed to empty)
- **AND** no new task is added

#### Scenario: createTask trims surrounding whitespace

- **GIVEN** a tasks array with 0 tasks
- **WHEN** `createTask(tasks, "  Trim me  ")` is called
- **THEN** the new task's `text` is "Trim me" (whitespace trimmed)

#### Scenario: toggleTask flips completed for matching id

- **GIVEN** a tasks array containing task "t1" with `completed` = false
- **WHEN** `toggleTask(tasks, "t1")` is called
- **THEN** a new array is returned where task "t1" has `completed` = true
- **AND** all other tasks in the array are unchanged
- **AND** the input array is not mutated

#### Scenario: toggleTask with non-existent id returns unchanged

- **GIVEN** a tasks array containing task "t1"
- **WHEN** `toggleTask(tasks, "nonexistent")` is called
- **THEN** a new array is returned with all tasks unchanged
- **AND** no task's `completed` field is modified

#### Scenario: toggleTask on empty array returns empty array

- **GIVEN** an empty tasks array
- **WHEN** `toggleTask(tasks, "any-id")` is called
- **THEN** an empty array is returned

#### Scenario: deleteTask removes matching id

- **GIVEN** a tasks array containing tasks "t1" and "t2"
- **WHEN** `deleteTask(tasks, "t1")` is called
- **THEN** a new array is returned containing only task "t2"
- **AND** the input array is not mutated

#### Scenario: deleteTask with non-existent id returns unchanged

- **GIVEN** a tasks array containing task "t1"
- **WHEN** `deleteTask(tasks, "nonexistent")` is called
- **THEN** a new array is returned with task "t1" still present
- **AND** the array length is unchanged

#### Scenario: deleteTask on empty array returns empty array

- **GIVEN** an empty tasks array
- **WHEN** `deleteTask(tasks, "any-id")` is called
- **THEN** an empty array is returned

#### Scenario: editTask updates text for matching id

- **GIVEN** a tasks array containing task "t1" with `text` = "Old"
- **WHEN** `editTask(tasks, "t1", "New")` is called
- **THEN** a new array is returned where task "t1" has `text` = "New"
- **AND** all other fields of task "t1" (`id`, `completed`, `createdAt`) are unchanged
- **AND** the input array is not mutated

#### Scenario: editTask trims surrounding whitespace

- **GIVEN** a tasks array containing task "t1" with `text` = "Old"
- **WHEN** `editTask(tasks, "t1", "  New text  ")` is called
- **THEN** task "t1" has `text` = "New text" (whitespace trimmed)

#### Scenario: editTask with empty text after trim leaves task unchanged

- **GIVEN** a tasks array containing task "t1" with `text` = "Original"
- **WHEN** `editTask(tasks, "t1", "   ")` is called
- **THEN** task "t1" retains `text` = "Original"
- **AND** no change is applied

#### Scenario: editTask with non-existent id returns unchanged

- **GIVEN** a tasks array containing task "t1"
- **WHEN** `editTask(tasks, "nonexistent", "New")` is called
- **THEN** a new array is returned with all tasks unchanged

#### Scenario: editTask on empty array returns empty array

- **GIVEN** an empty tasks array
- **WHEN** `editTask(tasks, "any-id", "New")` is called
- **THEN** an empty array is returned

#### Scenario: Immutability invariant — all pure functions return new array reference

- **GIVEN** a tasks array with 2 tasks
- **WHEN** `createTask(tasks, "X")`, `toggleTask(tasks, "t1")`, `deleteTask(tasks, "t1")`, and `editTask(tasks, "t1", "Y")` are each called
- **THEN** each call returns a different array reference than the input array
- **AND** the input array is not mutated by any call