# Design: Task Core

Architecture decisions and implementation approach for the task-core change. This document is implementation-ready: a developer can build directly from it without making further architectural decisions.

---

## 1. Module Architecture

### 1.1 File Layout

```
todo-app/
├── index.html          # Semantic structure: input + list
├── styles.css           # Minimal styling
├── app.js               # All logic: pure functions + storage + DOM layer
├── test/
│   ├── helpers.js       # MockStorage, crypto.randomUUID stub, test factories
│   ├── task.test.js     # Pure function tests (create/toggle/delete/edit)
│   └── storage.test.js  # Persistence tests (save/load)
```

### 1.2 Internal Organization of app.js

`app.js` is a single file organized into three clearly delimited sections, separated by comment banners:

```js
// ============================================================
// SECTION 1: Pure Functions — Task CRUD logic (no side effects)
// ============================================================

function createTask(tasks, text) { ... }
function toggleTask(tasks, id) { ... }
function deleteTask(tasks, id) { ... }
function editTask(tasks, id, newText) { ... }

// ============================================================
// SECTION 2: Storage Module — localStorage persistence
// ============================================================

function saveTasks(tasks) { ... }
function loadTasks() { ... }

// ============================================================
// SECTION 3: DOM Layer — event wiring and rendering
// ============================================================

function render(tasks) { ... }
function handleCreate() { ... }
function handleListClick(e) { ... }
function handleListDblClick(e) { ... }
function enterEditMode(li, task) { ... }
function exitEditMode(li, task, input) { ... }
function init() { ... }
```

### 1.3 Cross-Environment Export Strategy

The pure functions and storage functions must be testable with `node --test` without a browser. Since there is no npm, no bundler, and no ES module configuration, we use the classic CommonJS guard pattern:

```js
// At the end of SECTION 2 (after all pure + storage functions are defined):

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTask,
    toggleTask,
    deleteTask,
    editTask,
    saveTasks,
    loadTasks,
  };
}
```

**In the browser:** `module` is undefined, so the guard is skipped. Functions remain in the global scope (or could be attached to `window.TodoApp`). The DOM layer functions (`render`, `handleCreate`, etc.) are NOT exported — they are browser-only and not tested in Node.

**In Node tests:** `module.exports` is available. Test files `require('../app.js')` and destructure the exported functions:

```js
const { createTask, toggleTask, deleteTask, editTask, saveTasks, loadTasks } = require('../app.js');
```

This approach has zero dependencies, requires no build step, and works in both environments.

### 1.4 Event Delegation Strategy

Instead of attaching listeners to each `<li>` (per-item), we attach a single listener to the `<ul id="todo-list">` container:

- **Click listener** on `<ul>`: inspects `e.target` to determine if the clicked element is:
  - A checkbox (`input[type="checkbox"]`) → call `toggleTask`, save, re-render.
  - A delete button (`button.todo__delete`) → call `deleteTask`, save, re-render.
- **Dblclick listener** on `<ul>`: inspects `e.target` to determine if the double-clicked element is:
  - A task text span (`span.todo__text`) → enter edit mode for that task's `<li>`.

Individual listeners that remain per-element:
- **Keydown listener** on `#new-task-input`: detects Enter key → `handleCreate()`.
- **DOMContentLoaded** on `document`: calls `init()` which loads tasks and renders.

This delegation approach handles dynamically added/removed `<li>` elements without needing to add/remove listeners.

---

## 2. Data Flow

Every user action follows the same unidirectional pipeline:

```
User action → DOM event → pure function(tasks, ...) → new tasks array → saveTasks(newTasks) → render(newTasks)
```

The `tasks` variable is module-scoped within `app.js` (not exported, not global). It is the single source of truth for the current state.

### 2.1 Create Task

```
User types text in #new-task-input → presses Enter
  → handleCreate()
    → text = input.value.trim()
    → if (text === '') return        // no-op on empty/whitespace
    → tasks = createTask(tasks, text)  // prepend new task
    → input.value = ''                 // clear input
    → saveTasks(tasks)                  // persist
    → render(tasks)                     // re-render list
```

### 2.2 Toggle Complete

```
User clicks checkbox in a task <li>
  → handleListClick(e)
    → e.target is checkbox → extract task id from li.dataset.id
    → tasks = toggleTask(tasks, id)   // flip completed
    → saveTasks(tasks)
    → render(tasks)
```

### 2.3 Delete Task

```
User clicks delete button in a task <li>
  → handleListClick(e)
    → e.target is delete button → extract task id from li.dataset.id
    → tasks = deleteTask(tasks, id)
    → saveTasks(tasks)
    → render(tasks)
```

### 2.4 Edit Task

```
User double-clicks task text
  → handleListDblClick(e)
    → e.target is span.todo__text → find parent li → extract task id
    → enterEditMode(li, task)
      → Replace span.todo__text with an <input type="text" class="todo__edit-input">
      → Input value = current task text
      → Store original text on the input element: input.dataset.original = task.text
      → Focus the input
      → Attach keydown listener (Enter → save, Escape → cancel)
      → Attach blur listener (→ save)

User presses Enter (or blurs):
  → newText = input.value.trim()
  → if (newText === '') → restore original, no save   // REQ-TM-004: empty reverts
  → tasks = editTask(tasks, id, newText)
  → saveTasks(tasks)
  → render(tasks)    // full re-render replaces input with span

User presses Escape:
  → Restore original text: input.dataset.original
  → render(tasks)    // re-render, discards input changes
  → No saveTasks call
```

**Note:** We use full re-render (`render(tasks)`) after edit save/cancel instead of swapping elements back. This simplifies the code — the input is destroyed when the `<ul>` is cleared and re-populated. The tradeoff is losing focus position, but since the edit is complete, this is acceptable.

---

## 3. DOM Structure

### 3.1 HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TODO</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="app">
    <h1>TODO</h1>
    <input id="new-task-input" type="text" placeholder="What needs to be done?" autocomplete="off">
    <ul id="todo-list"></ul>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

The `<ul id="todo-list">` starts empty. All `<li>` elements are created dynamically by `render()`.

### 3.2 Task List Item Structure (rendered by JS)

Each task is rendered as:

```html
<li class="todo-item" data-id="task-uuid-here">
  <input type="checkbox" class="todo__checkbox">
  <span class="todo__text">Buy milk</span>
  <button class="todo__delete" aria-label="Delete task">×</button>
</li>
```

Completed tasks get an additional class:

```html
<li class="todo-item todo-item--completed" data-id="...">
  ...
</li>
```

### 3.3 Edit Mode DOM

When the user double-clicks `span.todo__text`, the span is replaced by an input:

```html
<li class="todo-item" data-id="task-uuid-here">
  <input type="checkbox" class="todo__checkbox">
  <input type="text" class="todo__edit-input" value="Buy milk" data-original="Buy milk">
  <button class="todo__delete" aria-label="Delete task">×</button>
</li>
```

The `data-original` attribute stores the original text for Escape-cancel and empty-text-revert.

### 3.4 DOM Creation Method

`render(tasks)` clears `#todo-list` (`ul.innerHTML = ''`) and creates each `<li>` via `document.createElement`:

```js
function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = task.completed ? 'todo-item todo-item--completed' : 'todo-item';
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo__delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';

    li.append(checkbox, span, deleteBtn);
    ul.appendChild(li);
  }
}
```

**Why `document.createElement` over `innerHTML`:** Cleaner, no XSS risk from task text, and straightforward attribute/property setting. Performance is fine for hundreds of tasks.

**Why full re-render over diffing:** Simplicity. The list is small. Full re-render avoids maintaining DOM references and sync logic. The tradeoff (acceptable per proposal) is that full re-render on every change is O(n) per mutation.

---

## 4. CSS Strategy

### 4.1 Approach

Minimal CSS, semantic class names with BEM-like naming. No dark mode, no animations, no responsive breakpoints in this change.

### 4.2 Key Styles (styles.css)

```css
/* Reset & base */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  color: #333;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.app {
  width: 100%;
  max-width: 480px;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Input */
#new-task-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 1rem;
}

#new-task-input:focus {
  outline: none;
  border-color: #4a90d9;
}

/* Task list */
#todo-list {
  list-style: none;
}

/* Task item */
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

/* Checkbox */
.todo__checkbox {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

/* Task text */
.todo__text {
  flex: 1;
  cursor: pointer;        /* hints that it's interactive (double-click to edit) */
  word-break: break-word;
}

/* Completed: strikethrough */
.todo-item--completed .todo__text {
  text-decoration: line-through;
  color: #999;
}

/* Delete button: visible only on hover */
.todo__delete {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #cc3333;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
  padding: 0 0.25rem;
}

.todo-item:hover .todo__delete {
  opacity: 1;
}

/* Edit input (inline) */
.todo__edit-input {
  flex: 1;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border: 1px solid #4a90d9;
  border-radius: 4px;
}
```

### 4.3 Design Decisions

- **Strikethrough** applied via `text-decoration: line-through` on `.todo-item--completed .todo__text`. The completed class is on the `<li>`, not the span, so we can also gray out the text color.
- **Delete button hover-only**: `opacity: 0` by default, `opacity: 1` on `.todo-item:hover`. This keeps the UI clean when not interacting with a specific task. A small CSS transition smooths the appearance.
- **No dark mode**: Out of scope. Light theme only.
- **No media queries**: The app uses `max-width: 480px` on the container, which is sufficient for mobile without explicit breakpoints.

---

## 5. Testing Architecture

### 5.1 Test Runner

Node.js built-in test runner, zero dependencies:

```bash
node --test test/
```

Node auto-discovers files matching `test/*.test.js`. Both `task.test.js` and `storage.test.js` are picked up automatically.

### 5.2 test/helpers.js

Shared test utilities, required by both test files:

```js
const { node:test, assert } = require('node:test');  // not needed, helpers doesn't run tests itself

class MockStorage {
  constructor() {
    this.data = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
  }
  setItem(key, value) {
    this.data[key] = value;
  }
  removeItem(key) {
    delete this.data[key];
  }
}

// Deterministic UUID stub
let uuidCounter = 0;
function stubUUID() {
  const original = crypto.randomUUID;
  crypto.randomUUID = () => `test-uuid-${++uuidCounter}`;
  return () => { crypto.randomUUID = original; };  // restore function
}

// Factory: create n test tasks
function makeTasks(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i + 1}`,
    text: `Task ${i + 1}`,
    completed: false,
    createdAt: `2026-07-24T19:45:0${i}.000Z`,
  }));
}

module.exports = { MockStorage, stubUUID, makeTasks };
```

**MockStorage** implements the `localStorage` interface (`getItem`, `setItem`, `removeItem`) using an in-memory object. Test files inject it into `saveTasks`/`loadTasks` by temporarily replacing `global.localStorage`.

**crypto.randomUUID stub**: Node 19+ provides `crypto.randomUUID` natively. For test determinism, `stubUUID()` replaces it with a counter-based generator (`test-uuid-1`, `test-uuid-2`, ...). Returns a restore function.

**makeTasks(n)**: Factory for test fixtures. Returns `n` tasks with predictable ids and timestamps.

### 5.3 Requiring app.js in Node

`app.js` exports pure functions + storage functions via the `module.exports` guard (see §1.3). In Node tests:

```js
// test/task.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createTask, toggleTask, deleteTask, editTask } = require('../app.js');
const { stubUUID, makeTasks } = require('./helpers');
```

```js
// test/storage.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { saveTasks, loadTasks } = require('../app.js');
const { MockStorage, makeTasks } = require('./helpers');
```

**How storage functions use localStorage:** `saveTasks` and `loadTasks` reference `localStorage` directly (global in browser). In tests, `global.localStorage = new MockStorage()` replaces it before each test, and is cleaned up after.

### 5.4 Test File Structure

**test/task.test.js** — Tests for pure functions:

```
describe('createTask')
  - adds task with correct fields at index 0
  - ignores empty text (returns unchanged array)
  - ignores whitespace-only text
  - trims surrounding whitespace
  - generates unique id (different from existing)
  - does not mutate input array (returns new reference)

describe('toggleTask')
  - flips completed: false → true
  - flips completed: true → false
  - toggling one task does not affect others
  - non-existent id returns array with unchanged tasks (new reference)
  - empty array returns empty array

describe('deleteTask')
  - removes matching id
  - removing one task does not affect others
  - non-existent id returns unchanged (new reference)
  - empty array returns empty array

describe('editTask')
  - updates text for matching id
  - trims surrounding whitespace
  - empty text after trim: task text unchanged
  - non-existent id returns unchanged
  - empty array returns empty array
  - does not mutate input array

describe('Immutability invariant')
  - all four functions return a different array reference
  - input array is not mutated by any call
```

**test/storage.test.js** — Tests for persistence:

```
describe('saveTasks')
  - writes JSON to localStorage under 'todos' key
  - writes '[]' for empty array
  - swallows QuotaExceededError (no throw)
  - swallows generic storage error

describe('loadTasks')
  - returns parsed array from valid JSON
  - returns [] when key is missing (getItem returns null)
  - returns [] on invalid JSON (SyntaxError caught)
  - returns [] when storage throws (security exception)

describe('Round-trip')
  - save then load returns identical data
  - save 2 tasks, load returns 2 tasks with all fields preserved
```

### 5.5 Test Conventions

- Each test file starts with `require('node:test')` and `require('node:assert/strict')`.
- Each `test()` call is named with a descriptive sentence: `test('createTask adds task at index 0 with correct fields', () => { ... })`.
- Immutability tests use `assert.notStrictEqual(result, inputArray)` to verify new reference.
- `assert.deepStrictEqual` for comparing task objects/arrays.
- UUID stub is set up in a `before` hook and restored in an `after` hook, or manually per test.

### 5.6 Red/Green/Refactor Order

Implementation follows this exact order (per proposal):

1. `createTask` — write tests → implement → green
2. `toggleTask` — write tests → implement → green
3. `deleteTask` — write tests → implement → green
4. `editTask` — write tests → implement → green
5. `saveTasks` + `loadTasks` — write tests → implement → green
6. DOM layer (`render`, `handleCreate`, `handleListClick`, `handleListDblClick`, `init`) — not tested in Node, manual browser verification.

---

## 6. Error Handling Strategy

### 6.1 localStorage Errors

**saveTasks:** wraps `localStorage.setItem` in try/catch. All errors (quota exceeded, security exception, disabled storage) are swallowed silently. The app continues operating in-memory. No user notification in this change (out of scope).

```js
function saveTasks(tasks) {
  try {
    localStorage.setItem('todos', JSON.stringify(tasks));
  } catch (e) {
    // Swallow: app continues in-memory
  }
}
```

**loadTasks:** wraps both `localStorage.getItem` and `JSON.parse` in a single try/catch. Any error (missing key returns null → parse of null → actually `"null"` is valid JSON returning `null`, but we handle `null` explicitly; invalid JSON → SyntaxError; storage exception) results in returning `[]`.

```js
function loadTasks() {
  try {
    const raw = localStorage.getItem('todos');
    if (raw === null) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
```

**Edge case — `localStorage.getItem` returns `null`:** `JSON.parse(null)` actually coerces `null` to the string `"null"` and parses it to `null`. We explicitly check `raw === null` before parsing to avoid this ambiguity and return `[]` directly.

**Edge case — parsed value is not an array:** If localStorage contains valid JSON that is not an array (e.g., `"{}"` or `"true"`), `JSON.parse` succeeds but returns a non-array. We add a guard:

```js
const parsed = JSON.parse(raw);
return Array.isArray(parsed) ? parsed : [];
```

### 6.2 JSON Parse Errors

Handled by the `catch` block in `loadTasks`. Corrupted JSON → `SyntaxError` → caught → return `[]`. No crash, no user notification.

### 6.3 Invalid Inputs to Pure Functions

Pure functions handle invalid input gracefully by returning the state unchanged:

| Function | Invalid Input | Behavior |
|----------|---------------|----------|
| `createTask` | empty string `""` | return input array unchanged |
| `createTask` | whitespace-only `"   "` | trim → empty → return unchanged |
| `createTask` | non-string text | return unchanged (defensive) |
| `toggleTask` | non-existent id | return new array with all tasks unchanged |
| `deleteTask` | non-existent id | return new array with all tasks unchanged |
| `editTask` | empty/whitespace text after trim | return new array with task text unchanged |
| `editTask` | non-existent id | return new array with all tasks unchanged |

**Important:** Even on invalid input, pure functions that return "unchanged" must still return a **new array reference** (per the immutability invariant in the spec). The exception is `createTask` with empty text, which the spec says returns "the same array reference unchanged" — we follow the spec literally:

```js
function createTask(tasks, text) {
  if (typeof text !== 'string') return tasks;
  const trimmed = text.trim();
  if (trimmed === '') return tasks;  // same reference, per spec scenario
  return [{ id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: new Date().toISOString() }, ...tasks];
}
```

For `toggleTask`, `deleteTask`, and `editTask` with non-existent ids, the spec says "returns a new array" — we use `.map()` and `.filter()` which naturally return new arrays:

```js
function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}
```

`.map()` always returns a new array reference, so the immutability invariant holds even when no task matches.

---

## 7. Browser Compatibility

### 7.1 ES6+ Features Used

| Feature | Usage | Browser Support |
|---------|-------|-----------------|
| `const` / `let` | All variable declarations | All modern browsers |
| Arrow functions | Callbacks in `.map()`, `.filter()` | All modern browsers |
| Template literals | Not used (avoiding for simplicity) | N/A |
| Destructuring | `const { id, text } = task` if needed | All modern browsers |
| Spread (`...`) | `{ ...t, completed: true }` and `[newTask, ...tasks]` | All modern browsers |
| `Array.from()` | `makeTasks` factory in tests | All modern browsers |
| `Array.map()` / `.filter()` | Core pure functions | All modern browsers |
| `for...of` | Iteration in `render()` | All modern browsers |
| `dataset` property | `li.dataset.id` | All modern browsers |
| `Element.append()` | `li.append(checkbox, span, deleteBtn)` | Chrome 54+, Firefox 63+, Safari 10+ |

**Target:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions). No IE support. No transpilation needed.

### 7.2 crypto.randomUUID() Fallback

`crypto.randomUUID()` requires a **secure context** (HTTPS or `localhost`). On HTTP served from a non-localhost origin, `crypto.randomUUID` is undefined.

**Fallback strategy:**

```js
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: RFC4122 v4-ish UUID using Math.random
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

`createTask` calls `generateId()` instead of `crypto.randomUUID()` directly. In tests, `stubUUID` patches `crypto.randomUUID` — but since `generateId` checks for `crypto.randomUUID`, the stub is picked up. If `crypto.randomUUID` is undefined (non-secure context), the fallback is used.

**Note:** The Math.random fallback is not cryptographically secure, but for a client-side TODO app ID generation, this is acceptable. No security-sensitive operations depend on the UUID.

### 7.3 No Transpilation

No Babel, no TypeScript, no bundler. `app.js` is loaded directly via `<script src="app.js">` in `index.html`. This works because:

- All features used are supported in modern browsers natively.
- `module.exports` guard does nothing in the browser (no `module` object).
- No ES module `import`/`export` (which would require `type="module"` and a server).

---

## 8. Implementation Reference Summary

### 8.1 Pure Function Implementations (Final)

```js
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createTask(tasks, text) {
  if (typeof text !== 'string') return tasks;
  const trimmed = text.trim();
  if (trimmed === '') return tasks;
  return [{
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  }, ...tasks];
}

function toggleTask(tasks, id) {
  return tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}

function deleteTask(tasks, id) {
  return tasks.filter(t => t.id !== id);
}

function editTask(tasks, id, newText) {
  if (typeof newText !== 'string') return tasks.map(t => t);  // new ref, no changes
  const trimmed = newText.trim();
  return tasks.map(t => {
    if (t.id !== id) return t;
    if (trimmed === '') return t;  // empty edit: keep original
    return { ...t, text: trimmed };
  });
}
```

**Note on `editTask` with empty text:** The spec says "task text unchanged" and "no change is applied". Since `.map()` returns a new array, the immutability invariant (new reference) is satisfied. The matching task returns the same object reference (`t`), while non-matching tasks also return the same object references. The array is new but the task objects inside are the same references. This is fine — the invariant is about array reference, not object reference.

### 8.2 Storage Function Implementations (Final)

```js
function saveTasks(tasks) {
  try {
    localStorage.setItem('todos', JSON.stringify(tasks));
  } catch (e) {
    // Swallow: app continues in-memory
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem('todos');
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
```

### 8.3 DOM Layer Skeleton (Final)

```js
let tasks = [];  // module-scoped state

function render(tasks) {
  const ul = document.getElementById('todo-list');
  ul.innerHTML = '';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = task.completed ? 'todo-item todo-item--completed' : 'todo-item';
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'todo__text';
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo__delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';

    li.append(checkbox, span, deleteBtn);
    ul.appendChild(li);
  }
}

function handleCreate() {
  const input = document.getElementById('new-task-input');
  const text = input.value.trim();
  if (text === '') return;
  tasks = createTask(tasks, text);
  input.value = '';
  saveTasks(tasks);
  render(tasks);
}

function handleListClick(e) {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('todo__checkbox')) {
    tasks = toggleTask(tasks, id);
    saveTasks(tasks);
    render(tasks);
  } else if (e.target.classList.contains('todo__delete')) {
    tasks = deleteTask(tasks, id);
    saveTasks(tasks);
    render(tasks);
  }
}

function handleListDblClick(e) {
  if (!e.target.classList.contains('todo__text')) return;
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = li.dataset.id;
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  enterEditMode(li, task);
}

function enterEditMode(li, task) {
  const span = li.querySelector('.todo__text');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo__edit-input';
  input.value = task.text;
  input.dataset.original = task.text;
  span.replaceWith(input);
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(li, task, input);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit(li, task);
    }
  });

  input.addEventListener('blur', () => {
    commitEdit(li, task, input);
  });
}

function commitEdit(li, task, input) {
  const newText = input.value.trim();
  if (newText === '') {
    cancelEdit(li, task);
    return;
  }
  tasks = editTask(tasks, task.id, newText);
  saveTasks(tasks);
  render(tasks);
}

function cancelEdit(li, task) {
  // Restore: just re-render from current state (input changes discarded)
  render(tasks);
}

function init() {
  tasks = loadTasks();
  render(tasks);

  document.getElementById('new-task-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCreate();
  });

  document.getElementById('todo-list').addEventListener('click', handleListClick);
  document.getElementById('todo-list').addEventListener('dblclick', handleListDblClick);
}

document.addEventListener('DOMContentLoaded', init);
```

**Edit mode blur/Enter deduplication:** When the user presses Enter, the `keydown` handler calls `commitEdit`, which calls `render(tasks)` (full re-render). This destroys the input element, which triggers a `blur` event. To prevent double-execution, we remove the blur listener before rendering, or use a guard flag:

```js
function commitEdit(li, task, input) {
  // Guard against double-call (Enter triggers blur after re-render)
  if (input.dataset.committed) return;
  input.dataset.committed = 'true';

  const newText = input.value.trim();
  if (newText === '') {
    cancelEdit(li, task);
    return;
  }
  tasks = editTask(tasks, task.id, newText);
  saveTasks(tasks);
  render(tasks);
}
```

This `dataset.committed` guard ensures `commitEdit` runs exactly once even if both keydown(Enter) and blur fire.

---

## 9. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single file `app.js` | All JS in one file | No build step, no module complexity; sections separated by comments |
| `module.exports` guard | `typeof module !== 'undefined'` | Zero-dependency cross-environment export; works without npm/bundler |
| Event delegation | Single listener on `<ul>` | Handles dynamic items without listener management; simpler than per-item |
| Full re-render | `ul.innerHTML = ''; ...appendChild` | Simple, correct, O(n). No diffing complexity for a TODO app |
| `document.createElement` | Over `innerHTML` template | No XSS from task text, clear property assignment |
| `generateId()` wrapper | Checks `crypto.randomUUID` availability | Works in secure and non-secure contexts; stubbable in tests |
| `let tasks` module scope | Single source of truth in `app.js` | Not exported, not global; only DOM layer mutates it via pure functions |
| `dataset.committed` guard | Prevents double-edit on Enter+blur | Simple flag on input element; cleaned up on re-render |
| `Array.isArray` guard in `loadTasks` | Rejects non-array parsed JSON | Defensive against corrupted/foreign data in localStorage |
| `Math.random` UUID fallback | Not cryptographically secure | Acceptable for client-side TODO IDs; no security dependency on UUIDs |