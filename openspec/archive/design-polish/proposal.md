# Proposal: Design Polish — Modern UI Upgrade

## Problem

The TODO app is functional but visually flat. No depth, no motion, no modern design patterns. In 2026, users expect micro-interactions, glassmorphism, and smooth transitions. The current design looks like a 2015 prototype.

## Solution

Apply modern design trends to the existing app without changing any logic:

1. **Glassmorphism** — task items and input use `backdrop-filter: blur()` with translucent backgrounds
2. **Gradient accents** — header title and active filter buttons use gradient text/backgrounds
3. **Soft shadows** — layered shadows (sm/md/lg) for depth perception
4. **Micro-interactions** — hover transforms (translateY, scale), checkbox scale on hover, delete button scale, theme toggle rotate
5. **List animations** — tasks fade-in + slide-down on appear (`@keyframes slideIn`)
6. **Better typography** — Inter font family, tighter letter-spacing on title, antialiased rendering
7. **Smooth transitions** — all interactive elements use `cubic-bezier(0.4, 0, 0.2, 1)` timing
8. **Responsive** — media query for mobile (480px breakpoint)
9. **Dark mode polish** — darker background gradient, adjusted shadows for dark theme
10. **Completed task opacity** — completed tasks fade to 65% opacity for visual de-emphasis

## Scope

Purely visual. No new JavaScript logic, no new tests, no new data model changes. All changes are in `styles.css` only.

## Architecture

### CSS Variables (New)

```css
--bg-gradient: linear-gradient(135deg, ...);
--accent-gradient: linear-gradient(135deg, #4a90d9 0%, #5b7cfa 100%);
--shadow-sm / --shadow-md / --shadow-lg: layered shadows
--radius: 12px (up from 6px)
--radius-sm: 8px
--transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
```

### Keyframes (New)

```css
@keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

### What Changed

| Element | Before | After |
|---------|--------|-------|
| Background | Solid `#f5f5f5` | Gradient `linear-gradient(135deg, #f0f2f5, #e8ecf3)` |
| Title | Plain text | Gradient text via `background-clip: text` |
| Task items | Flat white, 6px radius | Glassmorphism blur, 8px radius, soft shadow |
| Hover | None | `translateY(-1px)` + shadow upgrade |
| Filter buttons | Flat | Glassmorphism + gradient on active |
| Checkboxes | Native | `accent-color` + scale on hover |
| Delete button | Opacity toggle | Opacity + scale on hover |
| Theme toggle | Static | Rotate + scale on hover |
| Completed tasks | Strikethrough only | Strikethrough + 65% opacity |
| Empty state | Static | Fade-in animation |
| Font | system-ui | Inter with antialiasing |
| Max width | 480px | 520px |
| Mobile | Not supported | `@media (max-width: 480px)` |