# Tasks: Dark Mode + Empty State

## 1. Dark Mode — CSS Variables

- [ ] 1.1 Replace all hardcoded colors in `styles.css` with CSS variables (`--bg`, `--text`, `--item-bg`, `--border`, `--muted`, `--accent`, `--accent-text`, `--danger`)
- [ ] 1.2 Add `[data-theme="dark"]` override block with dark color values
- [ ] 1.3 Update `body`, `.app`, `.todo-item`, `.todo__text`, `.todo__delete`, `.filter-btn`, `.clear-completed`, `.app-footer`, `.empty-state` to use `var(--xxx)`

## 2. Dark Mode — HTML

- [ ] 2.1 Add `<button class="theme-toggle" aria-label="Toggle dark mode">🌙</button>` next to "TODO" title in `index.html`

## 3. Dark Mode — CSS for Toggle Button

- [ ] 3.1 Add `.theme-toggle` styles (no border/background, font-size, cursor, vertical-align)

## 4. Dark Mode — Storage Functions

- [ ] 4.1 Implement `saveTheme(theme)` in `app.js` SECTION 2
- [ ] 4.2 Implement `loadTheme()` in `app.js` SECTION 2 (validate `'light'`/`'dark'`, default `'light'`)
- [ ] 4.3 Add `saveTheme`, `loadTheme` to `module.exports`

## 5. Dark Mode — DOM Layer

- [ ] 5.1 Add `let currentTheme = 'light'` module-scoped variable
- [ ] 5.2 Implement `applyTheme(theme)` — sets `document.documentElement.dataset.theme` and updates toggle button emoji
- [ ] 5.3 Implement `handleThemeToggle()` — flips `currentTheme`, saves, applies
- [ ] 5.4 Wire toggle button click listener in `init()`
- [ ] 5.5 Restore theme in `init()`: `currentTheme = loadTheme(); applyTheme(currentTheme);`

## 6. Empty State — Render Integration

- [ ] 6.1 Implement `getEmptyMessage()` — returns contextual message based on `tasks.length` and `currentFilter`
- [ ] 6.2 In `render()`, after the for loop, if `visible.length === 0` append `<li class="empty-state">` with message

## 7. Empty State — CSS

- [ ] 7.1 Add `.empty-state` styles (text-align center, muted color, small font, padding, list-style none)

## 8. Full Test Suite — Green Confirmation

- [ ] 8.1 Run `node --test test/*.test.js` and confirm all tests pass (Green)
- [ ] 8.2 Refactor if needed — re-run tests, confirm still Green

## 9. Manual Verification

- [ ] 9.1 Open app with hard refresh — light mode default
- [ ] 9.2 Click toggle → dark mode applies immediately (dark background, light text)
- [ ] 9.3 Reload page → dark mode persists
- [ ] 9.4 Click toggle again → back to light mode
- [ ] 9.5 No tasks → "No tasks yet. Add one above!" message
- [ ] 9.6 Create tasks, complete all, switch to Active → "No active tasks. Nice work!"
- [ ] 9.7 With no completed tasks, switch to Completed → "No completed tasks yet."
- [ ] 9.8 Empty state message visible in both light and dark mode