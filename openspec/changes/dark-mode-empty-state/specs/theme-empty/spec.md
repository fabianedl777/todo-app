# Spec: Dark Mode + Empty State

---

## Dark Mode

### REQ-DM-001: Theme Toggle

The app SHALL provide a dark mode toggle button in the header.

- Button displays 🌙 in light mode and ☀️ in dark mode.
- Clicking toggles between light and dark themes.
- Theme is applied immediately via `data-theme` attribute on `<html>`.

### REQ-DM-002: Theme Persistence

The app SHALL persist the theme preference to `localStorage` under key `theme`.

- Valid values: `'light'`, `'dark'`. Default: `'light'`.
- On `init()`, saved theme is restored and applied.
- Invalid/missing value defaults to `'light'`.

### REQ-DM-003: CSS Variables

All colors SHALL use CSS variables. Dark theme overrides variables via `[data-theme="dark"]` selector.

---

## Empty State

### REQ-ES-001: Empty State Messages

When the rendered list is empty, the app SHALL display a contextual message.

- No tasks at all: "No tasks yet. Add one above!"
- Filter "Active", no active tasks: "No active tasks. Nice work!"
- Filter "Completed", no completed tasks: "No completed tasks yet."
- Message is centered, muted color, small font.
- Message appears inside `#todo-list` as a single `<li class="empty-state">`.