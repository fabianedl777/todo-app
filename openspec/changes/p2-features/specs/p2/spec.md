# Spec: P2 Features

---

## REQ-P2-001: Priority Filters

Second filter row with All / High / Medium / Low buttons. Combined with existing completion filter in `render()`.

- `filterByPriority(tasks, priority)` pure function
- `currentPriorityFilter` state, persisted in `localStorage` key `priorityFilter`
- Default: `'all'`

## REQ-P2-002: Creation Date Visible

Each task shows relative time: "just now", "5m ago", "2h ago", "3d ago", "Jul 25".

- `formatRelativeTime(isoString)` pure function
- `<span class="todo__date">` below task text

## REQ-P2-003: Animations

- Create: slideIn (exists)
- Delete: slideOut before removing
- Complete: opacity pulse

## REQ-P2-004: Export/Import JSON

- Export: downloads `todo-backup-{date}.json`
- Import: file input, validates, merges with dedup
- `importTasks(existing, imported)` pure function