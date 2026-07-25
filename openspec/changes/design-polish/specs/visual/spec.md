# Spec: Design Polish

---

## Requirements

### REQ-DP-001: Glassmorphism

Task items, input, and filter buttons SHALL use translucent backgrounds with `backdrop-filter: blur()`.

- `backdrop-filter: blur(12px)` on task items and input
- `backdrop-filter: blur(8px)` on filter buttons
- Backgrounds use `rgba()` with 85% opacity (light) / 75% opacity (dark)

### REQ-DP-002: Gradient Accents

The app SHALL use gradient accents for visual interest.

- Header title: gradient text (`linear-gradient(135deg, #4a90d9, #5b7cfa)`) via `background-clip: text`
- Active filter button: gradient background
- Body background: subtle gradient (`linear-gradient(135deg, #f0f2f5, #e8ecf3)`)

### REQ-DP-003: Soft Shadows

The app SHALL use layered shadows for depth.

- `--shadow-sm`: `0 1px 3px rgba(0,0,0,0.06)` — resting state
- `--shadow-md`: `0 4px 12px rgba(0,0,0,0.08)` — hover state
- `--shadow-lg`: `0 8px 24px rgba(0,0,0,0.10)` — elevated state
- Dark mode: stronger shadows (higher alpha)

### REQ-DP-004: Micro-interactions

Interactive elements SHALL have hover feedback.

- Task items: `translateY(-1px)` + shadow upgrade on hover
- Checkboxes: `scale(1.15)` on hover
- Priority dots: `scale(1.3)` on hover
- Delete buttons: `scale(1.2)` on hover
- Theme toggle: `scale(1.15) rotate(15deg)` on hover
- Filter buttons: `translateY(-1px)` + shadow on hover

### REQ-DP-005: List Animations

Tasks SHALL animate on appearance.

- `@keyframes slideIn`: fade-in + slide-down (0.25s, cubic-bezier)
- Empty state: `@keyframes fadeIn` (0.3s)

### REQ-DP-006: Typography

The app SHALL use Inter font with antialiased rendering.

- `font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`
- `-webkit-font-smoothing: antialiased`
- Title: `font-weight: 700`, `letter-spacing: -0.02em`

### REQ-DP-007: Completed Task De-emphasis

Completed tasks SHALL fade to 65% opacity in addition to strikethrough.

### REQ-DP-008: Responsive

The app SHALL adapt to mobile screens.

- `@media (max-width: 480px)`: reduced padding, smaller title, full-width container

### REQ-DP-009: Dark Mode Polish

Dark mode SHALL have its own gradient background and adjusted shadows.

- Background: `linear-gradient(135deg, #0d1117, #161b2e)`
- Shadows: higher alpha for visibility on dark backgrounds