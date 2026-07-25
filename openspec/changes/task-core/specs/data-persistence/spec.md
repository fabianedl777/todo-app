# Spec: Data Persistence

Requirements and scenarios for localStorage persistence and the storage module.

---

## Requirements

### REQ-DP-001: Persist to localStorage

The app SHALL persist the full tasks array to localStorage under the key `todos` after every mutation (create, toggle, delete, edit).

- Data is stored as `JSON.stringify(tasks)`.
- On page load (`DOMContentLoaded`), the app SHALL restore tasks from localStorage via `loadTasks()`.
- If localStorage is empty or the key is missing, the app starts with an empty list.
- If localStorage contains corrupted/invalid JSON, the app treats it as empty (no crash).
- If localStorage is unavailable (disabled, quota exceeded, or throws), the app continues to operate in-memory without crashing.

### REQ-DP-002: Storage Module

The app SHALL provide two storage functions:

- `loadTasks()` — reads from localStorage key `todos`, parses JSON, returns an array. Returns `[]` on any error.
- `saveTasks(tasks)` — writes `JSON.stringify(tasks)` to localStorage key `todos`. Swallows errors silently.

---

## Scenarios

### Persist to localStorage

#### Scenario: Tasks survive page reload

- **GIVEN** the tasks array contains 2 tasks: task A (`id` = "t1", `text` = "Buy milk", `completed` = false, `createdAt` = "2026-07-24T19:45:00.000Z") and task B (`id` = "t2", `text` = "Walk dog", `completed` = true, `createdAt` = "2026-07-24T19:46:00.000Z")
- **WHEN** the page is reloaded
- **THEN** `loadTasks()` returns an array with both tasks
- **AND** each task retains its full state: `id`, `text`, `completed`, and `createdAt` values are identical to before reload

#### Scenario: Empty localStorage yields empty list

- **GIVEN** localStorage has no `todos` key (or is completely empty)
- **WHEN** the page loads and `loadTasks()` is called
- **THEN** an empty array `[]` is returned
- **AND** no error is thrown

#### Scenario: Corrupted JSON treated as empty

- **GIVEN** localStorage key `todos` contains invalid JSON string `"{{broken json}"`
- **WHEN** `loadTasks()` is called
- **THEN** an empty array `[]` is returned
- **AND** no exception is thrown (error is caught internally)

#### Scenario: localStorage unavailable — app works in-memory

- **GIVEN** localStorage access throws an error (e.g., disabled by browser settings or security policy)
- **WHEN** the app initializes and calls `loadTasks()`
- **THEN** an empty array `[]` is returned
- **AND** the app renders an empty list without crashing
- **AND** the user can still create, complete, delete, and edit tasks in-memory

#### Scenario: Save writes current state after any mutation

- **GIVEN** the tasks array contains 1 task
- **WHEN** a mutation occurs (create, toggle, delete, or edit)
- **THEN** `saveTasks(tasks)` is called with the new state
- **AND** localStorage key `todos` is updated to reflect the new state

#### Scenario: Quota exceeded — graceful handling

- **GIVEN** the tasks array is large enough to exceed localStorage quota
- **WHEN** `saveTasks(tasks)` is called and `localStorage.setItem` throws a `QuotaExceededError`
- **THEN** the error is caught and swallowed
- **AND** the app continues to operate in-memory without crashing
- **AND** the user can still interact with tasks (create, toggle, delete, edit)

---

### Storage Module

#### Scenario: loadTasks returns parsed array from valid JSON

- **GIVEN** localStorage key `todos` contains `[{"id":"t1","text":"Buy milk","completed":false,"createdAt":"2026-07-24T19:45:00.000Z"}]`
- **WHEN** `loadTasks()` is called
- **THEN** an array with 1 task object is returned
- **AND** the task object has `id` = "t1", `text` = "Buy milk", `completed` = false, `createdAt` = "2026-07-24T19:45:00.000Z"

#### Scenario: loadTasks returns empty array when key is missing

- **GIVEN** localStorage has no `todos` key (i.e., `getItem('todos')` returns `null`)
- **WHEN** `loadTasks()` is called
- **THEN** an empty array `[]` is returned

#### Scenario: loadTasks returns empty array on invalid JSON

- **GIVEN** localStorage key `todos` contains invalid JSON string `"not valid json`
- **WHEN** `loadTasks()` is called
- **THEN** `JSON.parse` throws a `SyntaxError`
- **AND** the error is caught
- **AND** an empty array `[]` is returned

#### Scenario: loadTasks returns empty array when storage throws

- **GIVEN** `localStorage.getItem` throws an error (e.g., security exception)
- **WHEN** `loadTasks()` is called
- **THEN** the error is caught
- **AND** an empty array `[]` is returned

#### Scenario: saveTasks writes JSON to todos key

- **GIVEN** a tasks array with 2 tasks
- **WHEN** `saveTasks(tasks)` is called
- **THEN** `localStorage.setItem('todos', ...)` is called
- **AND** the value is `JSON.stringify(tasks)` representing the full array

#### Scenario: saveTasks writes empty array as "[]"

- **GIVEN** an empty tasks array
- **WHEN** `saveTasks([])` is called
- **THEN** `localStorage.setItem('todos', '[]')` is called

#### Scenario: saveTasks swallows quota error

- **GIVEN** `localStorage.setItem` throws a `QuotaExceededError`
- **WHEN** `saveTasks(tasks)` is called
- **THEN** the error is caught and swallowed
- **AND** no exception propagates to the caller

#### Scenario: saveTasks swallows generic storage error

- **GIVEN** `localStorage.setItem` throws a generic error (e.g., security exception)
- **WHEN** `saveTasks(tasks)` is called
- **THEN** the error is caught and swallowed
- **AND** no exception propagates to the caller