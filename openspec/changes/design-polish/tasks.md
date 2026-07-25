# Tasks: Design Polish — Modern UI Upgrade

## 1. CSS Variables — Light Theme

- [x] 1.1 Update `--bg` to `#f0f2f5` and add `--bg-gradient` linear-gradient
- [x] 1.2 Update `--item-bg` to `rgba(255, 255, 255, 0.85)` for glassmorphism
- [x] 1.3 Update `--border` to `rgba(0, 0, 0, 0.06)` and `--muted` to `#8e8e93`
- [x] 1.4 Add `--accent-gradient` linear-gradient
- [x] 1.5 Add `--shadow-sm`, `--shadow-md`, `--shadow-lg` layered shadows
- [x] 1.6 Add `--radius: 12px`, `--radius-sm: 8px`, `--transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

## 2. CSS Variables — Dark Theme

- [x] 2.1 Update `--bg` to `#0d1117` and add dark `--bg-gradient`
- [x] 2.2 Update `--item-bg` to `rgba(22, 27, 46, 0.75)`
- [x] 2.3 Update `--border`, `--accent`, `--danger` for dark mode
- [x] 2.4 Add dark mode shadow variants (higher alpha)

## 3. Body & Typography

- [x] 3.1 Update `body` background to `var(--bg-gradient)` with `background-attachment: fixed`
- [x] 3.2 Update font-family to `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`
- [x] 3.3 Add `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`
- [x] 3.4 Update `.app` max-width to `520px`

## 4. Header

- [x] 4.1 Update `h1` to `font-size: 1.75rem`, `font-weight: 700`, `letter-spacing: -0.02em`
- [x] 4.2 Add gradient text via `background-clip: text` + `-webkit-text-fill-color: transparent`
- [x] 4.3 Add `.theme-toggle:hover` transform `scale(1.15) rotate(15deg)`

## 5. Input

- [x] 5.1 Update border-radius to `var(--radius)` (12px)
- [x] 5.2 Add `backdrop-filter: blur(12px)` and translucent background
- [x] 5.3 Add focus ring: `box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15)`
- [x] 5.4 Add `::placeholder` color

## 6. Filter Buttons

- [x] 6.1 Add `backdrop-filter: blur(8px)` and translucent background
- [x] 6.2 Active state uses `var(--accent-gradient)`
- [x] 6.3 Add hover `translateY(-1px)` + shadow upgrade
- [x] 6.4 Add `box-shadow: var(--shadow-sm)` resting state

## 7. Task Items

- [x] 7.1 Add `backdrop-filter: blur(12px)` and translucent background
- [x] 7.2 Update border-radius to `var(--radius-sm)` (8px)
- [x] 7.3 Add `box-shadow: var(--shadow-sm)` resting
- [x] 7.4 Add hover `translateY(-1px)` + `--shadow-md`
- [x] 7.5 Add `slideIn` animation on appear
- [x] 7.6 Add `.todo-item--completed { opacity: 0.65 }`

## 8. Interactive Elements

- [x] 8.1 Checkbox: `accent-color: var(--accent)` + hover `scale(1.15)`
- [x] 8.2 Priority dot: hover `scale(1.3)`
- [x] 8.3 Delete button: hover `scale(1.2)` in addition to opacity
- [x] 8.4 Theme toggle: hover `scale(1.15) rotate(15deg)`

## 9. Empty State & Edit Input

- [x] 9.1 Empty state: `fadeIn` animation, padding `2.5rem 1rem`
- [x] 9.2 Edit input: `1.5px` border, focus ring shadow

## 10. Responsive

- [x] 10.1 Add `@media (max-width: 480px)` with reduced padding, smaller title, full-width

## 11. Keyframes

- [x] 11.1 `@keyframes slideIn` — fade-in + slide-down
- [x] 11.2 `@keyframes fadeIn` — simple opacity fade

## 12. Verification

- [ ] 12.1 Run `node --test test/*.test.js` — confirm 63 tests still green
- [ ] 12.2 Screenshot with Chromium — verify light mode visual
- [ ] 12.3 Screenshot with Chromium — verify dark mode visual
- [ ] 12.4 Screenshot with Chromium — verify mobile responsive