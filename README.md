# TODO App

A minimal, dependency-free TODO app built with vanilla JavaScript. Features CRUD operations, filters, priorities, dark mode (Drácula theme), and localStorage persistence. Deployed on GitHub Pages.

**Live demo:** https://fabianedl777.github.io/todo-app/

---

## Features

- **Create, edit, delete tasks** — full CRUD with inline editing (double-click to edit)
- **Complete tasks** — checkbox toggle with strikethrough + opacity
- **Filters** — All / Active / Completed (by status) + All / High / Medium / Low (by priority)
- **Priority levels** — High (red), Medium (gray), Low (blue). Click the dot to cycle.
- **Task counter** — "X items left" updates in real-time
- **Clear completed** — bulk delete all completed tasks
- **Dark mode** — Drácula theme toggle, persists across reloads
- **Empty states** — contextual messages when no tasks match the current filter
- **Creation date** — relative time shown per task ("5m ago", "2h ago", "Jul 25")
- **Animations** — slide-in on create, slide-out on delete, pulse on complete
- **Export/Import** — backup tasks to JSON file, restore with dedup by id
- **Responsive** — adapts to mobile screens
- **Glassmorphism UI** — backdrop blur, gradient accents, soft shadows

## Quick Start

```bash
# Clone
git clone https://github.com/fabianedl777/todo-app.git
cd todo-app

# Run tests
node --test test/*.test.js

# Open the app
open index.html
# or just open index.html in your browser
```

No build step. No dependencies. No npm install. Just open `index.html`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | Semantic HTML |
| Styling | CSS variables, glassmorphism, Drácula dark theme |
| Logic | Vanilla ES6+ JavaScript (no frameworks) |
| Tests | Node.js built-in test runner (`node:test`) |
| Persistence | `localStorage` (keys: `todos`, `filter`, `theme`, `priorityFilter`) |
| Deploy | GitHub Pages via GitHub Actions |
| Code Review | Gentleman Guardian Angel (GGA) with Ollama Cloud |
| Code Intelligence | CodeGraph v1.5.0 |

## Architecture

```
app.js
├── SECTION 1: Pure Functions (no side effects)
│   ├── generateId()          — UUID with crypto fallback
│   ├── createTask()           — prepend new task
│   ├── toggleTask()           — flip completed
│   ├── deleteTask()           — remove by id
│   ├── editTask()             — update text
│   ├── filterTasks()          — filter by completion status
│   ├── countActive()          — count non-completed
│   ├── clearCompleted()       — remove all completed
│   ├── setPriority()          — set high/medium/low
│   ├── filterByPriority()     — filter by priority level
│   ├── formatRelativeTime()   — ISO date to relative string
│   └── importTasks()          — merge + dedupe by id
├── SECTION 2: Storage Module (localStorage)
│   ├── saveTasks / loadTasks
│   ├── saveFilter / loadFilter
│   ├── saveTheme / loadTheme
│   └── savePriorityFilter / loadPriorityFilter
├── Export Guard (module.exports — Node only)
└── SECTION 3: DOM Layer (event wiring + rendering)
    ├── render()               — filter + build DOM list
    ├── handleCreate()         — Enter key → create
    ├── handleListClick()      — checkbox/delete/priority cycle
    ├── handleListDblClick()   — inline edit mode
    ├── handleFilterClick()    — completion filter buttons
    ├── handlePriorityFilterClick() — priority filter buttons
    ├── handleClearCompleted() — bulk delete completed
    ├── handleThemeToggle()    — dark/light mode
    ├── handleExport()         — download JSON backup
    ├── handleImport()         — read + merge JSON
    └── init()                 — restore state + wire listeners
```

## Testing

```bash
node --test test/*.test.js
```

- **83 tests**, all passing
- `test/task.test.js` — pure function tests (create, toggle, delete, edit, filter, count, clear, priority, filterByPriority, formatRelativeTime, importTasks)
- `test/storage.test.js` — persistence tests (save, load, round-trip)
- `test/helpers.js` — MockStorage, stubUUID, makeTasks factory
- **Strict TDD**: Red → Green → Refactor for every feature

## Development Workflow

This project uses **Spec-Driven Development (SDD)** via OpenSpec:

1. **Proposal** → `openspec/changes/<name>/proposal.md`
2. **Spec** → `openspec/changes/<name>/specs/<area>/spec.md`
3. **Design** → `openspec/changes/<name>/design.md`
4. **Tasks** → `openspec/changes/<name>/tasks.md`
5. **Implementation** — TDD: tests first (Red), then code (Green)
6. **Verify** — tests green + browser verification
7. **Archive** — move to `openspec/archive/` when complete

### Code Review

Every commit is reviewed by **GGA (Gentleman Guardian Angel)** using `ollama:glm-5.2:cloud`. The reviewer validates code against `AGENTS.md` rules before allowing the commit.

### CodeGraph

Project is indexed with CodeGraph for AI-assisted code navigation:

```bash
codegraph explore "query"    # explore an area
codegraph node <symbol-name>  # inspect a symbol
codegraph status              # index statistics
codegraph sync                # rebuild after changes
```

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`). No AI attribution.
- **No dependencies**: zero npm packages in production
- **Immutability**: pure functions return new array references, never mutate input
- **Event delegation**: single listeners on containers, not per-item
- **Cross-environment**: `module.exports` guard for Node tests, ignored in browser
- **CSS variables**: all colors via `var(--xxx)`. Dark theme via `[data-theme="dark"]`
- **Cache-busting**: GitHub Actions injects commit hash into CSS/JS URLs

## Project Structure

```
todo-app/
├── index.html              # Semantic structure
├── styles.css              # CSS variables, glassmorphism, Drácula theme
├── app.js                  # All logic: pure functions + storage + DOM
├── package.json            # Metadata only (no dependencies)
├── .gga                    # GGA configuration (ollama:glm-5.2:cloud)
├── .gitignore
├── AGENTS.md               # AI agent instructions
├── PRD.md                  # Product requirements
├── README.md               # This file
├── test/
│   ├── helpers.js          # MockStorage, stubUUID, makeTasks
│   ├── task.test.js        # Pure function tests
│   └── storage.test.js     # Persistence tests
├── openspec/
│   ├── changes/            # Active SDD changes
│   └── archive/            # Completed changes
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deploy with cache-busting
```

## License

MIT

## Roadmap

See [PRD.md](PRD.md) for the full product roadmap. Remaining features:

- 🔲 Drag & drop reorder (P1)
- 🔲 Dark mode polish refinements
- 🔲 Additional P2/P3 features