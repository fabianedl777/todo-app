# AGENTS.md — TODO App

## Project Overview

Vanilla JS TODO app with CRUD, filters, priorities, dark mode (Drácula), and localStorage persistence. Deployed on GitHub Pages. Zero dependencies, zero build step.

**Live:** https://fabianedl777.github.io/todo-app/
**Repo:** https://github.com/fabianedl777/todo-app

## Tech Stack

- **HTML** — semantic structure (`index.html`)
- **CSS** — CSS variables, glassmorphism, Drácula dark theme (`styles.css`)
- **JavaScript (ES6+)** — vanilla, no frameworks, no bundler (`app.js`)
- **Tests** — Node.js built-in test runner (`node:test`)
- **Persistence** — `localStorage` (keys: `todos`, `filter`, `theme`)
- **Deploy** — GitHub Pages via GitHub Actions

## Architecture

```
app.js
├── SECTION 1: Pure Functions (no side effects)
│   ├── generateId()        — UUID with fallback
│   ├── createTask()        — prepend new task
│   ├── toggleTask()        — flip completed
│   ├── deleteTask()        — remove by id
│   ├── editTask()          — update text
│   ├── filterTasks()       — all/active/completed
│   ├── countActive()       — active count
│   ├── clearCompleted()    — bulk delete
│   └── setPriority()       — high/medium/low
├── SECTION 2: Storage Module
│   ├── saveTasks/loadTasks
│   ├── saveFilter/loadFilter
│   └── saveTheme/loadTheme
├── Export Guard (module.exports — Node only)
└── SECTION 3: DOM Layer
    ├── render()            — filterTasks + build DOM
    ├── handleCreate()      — Enter key → create
    ├── handleListClick()   — checkbox/delete/priority cycle
    ├── handleListDblClick()— inline edit
    ├── handleFilterClick() — filter buttons
    ├── handleClearCompleted()
    ├── handleThemeToggle()
    └── init()              — restore state + wire listeners
```

## Testing

```bash
node --test test/*.test.js
```

- **63 tests**, all passing
- Pure functions tested in `test/task.test.js`
- Storage functions tested in `test/storage.test.js`
- Helpers in `test/helpers.js` (MockStorage, stubUUID, makeTasks)
- **Strict TDD**: Red → Green → Refactor for every feature

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`). No AI attribution.
- **No dependencies**: zero npm packages in production. `package.json` is metadata only.
- **Immutability**: all pure functions return new array references, never mutate input.
- **Event delegation**: single listeners on containers (`#todo-list`, `.filters`), not per-item.
- **Cross-environment**: `module.exports` guard allows `require()` in Node, ignores in browser.
- **CSS variables**: all colors via `var(--xxx)`. Dark theme via `[data-theme="dark"]`.
- **Cache-busting**: GitHub Actions workflow injects commit hash into CSS/JS URLs automatically.

## SDD (Spec-Driven Development)

Changes follow the OpenSpec workflow:

1. **Proposal** (`openspec/changes/<name>/proposal.md`) — problem + solution + scope
2. **Spec** (`openspec/changes/<name>/specs/<area>/spec.md`) — requirements + scenarios
3. **Design** (`openspec/changes/<name>/design.md`) — architecture + implementation reference
4. **Tasks** (`openspec/changes/<name>/tasks.md`) — ordered checklist
5. **Implementation** — TDD: tests first (Red), then code (Green)
6. **Verify** — tests green + manual browser verification
7. **Archive** — move to `openspec/archive/` when complete

## CodeGraph

Project indexed with CodeGraph v1.5.0. Use `codegraph_explore` MCP tool or CLI:

```bash
codegraph explore "query"
codegraph node <symbol-name>
codegraph status
codegraph sync   # after changes
```

Index: 47 nodes, 237 edges. Auto-syncs on file changes.

## Pending Features

- **Drag & drop reorder** (P1 — last pending from PRD)
- See `PRD.md` for full roadmap

## Files

| File | Role |
|------|------|
| `index.html` | Semantic structure + filter bar + footer |
| `styles.css` | CSS variables, glassmorphism, Drácula theme, responsive |
| `app.js` | All logic: pure functions + storage + DOM layer |
| `test/helpers.js` | MockStorage, stubUUID, makeTasks factory |
| `test/task.test.js` | Pure function tests (create/toggle/delete/edit/filter/count/clear/priority) |
| `test/storage.test.js` | Persistence tests (save/load/round-trip) |
| `PRD.md` | Product requirements document |
| `openspec/` | SDD changes (active + archived) |
| `.github/workflows/deploy.yml` | GitHub Pages deploy with cache-busting |