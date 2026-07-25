# Proposal: Task Core — CRUD + Persistence

## Problem

The TODO app needs a foundation: the ability to create, complete, delete, and edit tasks, with persistence so tasks survive page reloads. Without this core layer, no other feature (filters, counters, priorities) can be built. This change delivers the minimal functional kernel that makes the app usable.

## Solution

Split logic from presentation:

- **Pure functions** handle all task operations (create, complete, delete, edit). These take a state array and return a new state array — no DOM, no side effects, trivially testable.
- **Thin DOM layer** wires event listeners to the pure functions, then re-renders the list from the returned state.
- **localStorage persistence** saves the entire tasks array as JSON under a single key (`todos`) after every mutation. On page load, the app reads from localStorage to restore state.

This separation enables Strict TDD: logic functions are tested with `node:test` using a localStorage mock — no browser needed.

## Scope

Exactly five features:

1. **Create task** — Type text in input, press Enter → task is added to the list.
2. **Mark completed** — Click checkbox → task toggles `completed` state (strikethrough styling).
3. **Delete task** — Click delete button on a task → task is removed from the list.
4. **Edit task text** — Double-click task text → text becomes editable; press Enter or blur to save, Escape to cancel.
5. **Persist to localStorage** — All task state is saved to localStorage on every change and restored on page load.

Nothing beyond these five.

## Architecture

### File Structure

```
todo-app/
├── index.html          # Semantic structure: input at top, list below
├── styles.css           # Minimal styling (no dark mode)
├── app.js               # All logic: pure functions + thin DOM layer
├── test/
│   ├── helpers.js       # MockStorage class, crypto.randomUUID stub, test utils
│   ├── task.test.js     # Tests for task CRUD pure functions
│   └── storage.test.js  # Tests for localStorage save/load
├── PRD.md
└── openspec/
    └── changes/
        └── task-core/
            └── proposal.md   # This file
```

### Data Model

Tasks are stored as a JSON array in localStorage under the key `todos`:

```json
[
  {
    "id": "uuid-v4-string",
    "text": "Buy milk",
    "completed": false,
    "createdAt": "2026-07-24T19:45:00.000Z"
  }
]
```

Fields per task:
- `id` — unique identifier (`crypto.randomUUID()`)
- `text` — the task text (non-empty string)
- `completed` — boolean, defaults to `false`
- `createdAt` — ISO timestamp string, set on creation

No `priority`, `filter`, or `theme` fields in this change.

### Pure Function Signatures (app.js)

```
createTask(tasks, text)              → [...tasks, { id, text, completed: false, createdAt }]
toggleTask(tasks, id)                → tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
deleteTask(tasks, id)                → tasks.filter(t => t.id !== id)
editTask(tasks, id, newText)         → tasks.map(t => t.id === id ? { ...t, text: newText } : t)
saveTasks(tasks)                      → localStorage.setItem('todos', JSON.stringify(tasks))
loadTasks()                           → JSON.parse(localStorage.getItem('todos') || '[]')
```

All task functions are **immutable**: they return new arrays, never mutate input.

### DOM Layer (app.js)

- `render(tasks)` — clears list, creates `<li>` elements for each task, attaches event listeners.
- Event delegation on the `<ul>` for checkbox clicks, delete button clicks, and double-click to edit.
- Input `keydown` listener for Enter key → `createTask` → `saveTasks` → `render`.
- `DOMContentLoaded` → `loadTasks` → `render`.

## TDD Strategy

### Test Runner

Node.js built-in test runner (`node:test`) + `node:assert/strict`. Zero dependencies. Run with:

```bash
node --test test/
```

### Test Files

**`test/helpers.js`** — Shared utilities:
- `MockStorage` class implementing `getItem`/`setItem` with an in-memory object.
- `randomUUID` stub returning deterministic IDs for reproducible tests.
- `makeTasks(n)` factory to create test fixtures.

**`test/task.test.js`** — Pure function tests:
- `createTask`: adds task with correct fields, ignores empty text, trims whitespace.
- `toggleTask`: flips `completed` for matching id, leaves others unchanged.
- `deleteTask`: removes matching id, leaves others unchanged.
- `editTask`: updates text for matching id, ignores empty/whitespace-only text.
- Immutability: input arrays are never mutated.

**`test/storage.test.js`** — Persistence tests:
- `saveTasks` writes JSON to localStorage (verified via MockStorage).
- `loadTasks` returns parsed array, returns `[]` when empty/missing key.
- Round-trip: save then load returns identical data.

### What's Manual (Not Tested)

- DOM rendering (requires browser).
- Event listeners (Enter key, checkbox click, delete button, double-click edit).
- Visual styling (strikethrough on completed, input layout).
- Page reload persistence (requires browser).

### Red/Green/Refactor Cycle

Per feature:
1. Write failing test → run → confirm red.
2. Implement minimal code to pass → run → confirm green.
3. Refactor if needed → run → confirm still green.

Order: `createTask` → `toggleTask` → `deleteTask` → `editTask` → `saveTasks`/`loadTasks`.

## Risks / Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| Pure functions + thin DOM | Slightly more indirection, but testable without browser and clear separation |
| Single `todos` key in localStorage | Simple. Scaling to many tasks or partial updates would need a different strategy — acceptable for a TODO app |
| `crypto.randomUUID()` for IDs | Available in modern browsers and Node 19+. Tests stub it for determinism |
| No virtual DOM / diffing | Full re-render on every change. Fine for hundreds of tasks; would need diffing for thousands |
| Immutable arrays (return new) | Slightly more GC pressure, but predictable and testable |
| Inline edit via `contenteditable` | Simple, no input swap. Need to handle blur/Enter/Escape carefully |

## Out of Scope

The following are explicitly **not** in this change:

- Filters (All / Active / Completed)
- Task counter (active count)
- Clear completed (bulk delete)
- Priorities (color coding, P1-P4)
- Dark mode toggle
- Drag & drop reorder
- Empty state message
- Export/Import JSON
- Responsive/mobile styling
- Animations
- GitHub Pages deployment setup

## Follow-up Changes

1. **task-filters** — All/Active/Completed tabs + active counter + clear completed
2. **task-priorities** — Priority field, color coding, priority-based sorting
3. **task-drag-drop** — Reorder tasks via drag and drop
4. **ui-polish** — Dark mode, empty state, animations, responsive styling
5. **deploy-setup** — GitHub Pages configuration + optional GitHub Actions