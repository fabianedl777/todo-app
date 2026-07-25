# Design: Design Polish

---

## 1. Approach

Purely CSS changes. No JavaScript logic modified. No new tests needed. Verification is visual (Chromium screenshot).

## 2. CSS Variables (New + Updated)

### 2.1 New Variables

```css
--bg-gradient: linear-gradient(135deg, #f0f2f5 0%, #e8ecf3 100%);
--accent-gradient: linear-gradient(135deg, #4a90d9 0%, #5b7cfa 100%);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.10);
--radius: 12px;
--radius-sm: 8px;
--transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### 2.2 Updated Variables

| Variable | Before | After |
|----------|--------|-------|
| `--bg` | `#f5f5f5` | `#f0f2f5` |
| `--item-bg` | `#fff` | `rgba(255, 255, 255, 0.85)` |
| `--border` | `#eee` | `rgba(0, 0, 0, 0.06)` |
| `--muted` | `#999` | `#8e8e93` |

### 2.3 Dark Theme Updates

| Variable | Before | After |
|----------|--------|-------|
| `--bg` | `#1a1a2e` | `#0d1117` |
| `--item-bg` | `#16213e` | `rgba(22, 27, 46, 0.75)` |
| `--border` | `#2a2a4a` | `rgba(255, 255, 255, 0.08)` |
| `--accent` | `#4a90d9` | `#58a6ff` |
| `--danger` | `#e74c3c` | `#ff7b72` |

## 3. Keyframes

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 4. Component Changes

### 4.1 Body
- Background: `var(--bg-gradient)` with `background-attachment: fixed`
- Font: `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif`
- Antialiasing: `-webkit-font-smoothing: antialiased`

### 4.2 Header (h1)
- Font size: 1.75rem (up from 1.5rem)
- Font weight: 700
- Letter-spacing: -0.02em
- Gradient text via `background-clip: text` + `-webkit-text-fill-color: transparent`

### 4.3 Input
- Border radius: `var(--radius)` (12px, up from 6px)
- `backdrop-filter: blur(12px)` for glassmorphism
- Focus: `box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15)` ring + `--shadow-md`
- Placeholder color: `var(--muted)`

### 4.4 Filter Buttons
- Background: `var(--item-bg)` with `backdrop-filter: blur(8px)`
- Active: `var(--accent-gradient)` background
- Hover: `translateY(-1px)` + `--shadow-md`

### 4.5 Task Items
- Background: `var(--item-bg)` with `backdrop-filter: blur(12px)`
- Border radius: `var(--radius-sm)` (8px)
- Box shadow: `--shadow-sm` (resting), `--shadow-md` (hover)
- Hover: `translateY(-1px)`
- Animation: `slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)` on appear
- Completed: `opacity: 0.65` (new)

### 4.6 Checkbox
- `accent-color: var(--accent)` for native styling
- Hover: `scale(1.15)`

### 4.7 Priority Dot
- Hover: `scale(1.3)`

### 4.8 Delete Button
- Hover: `scale(1.2)` (in addition to opacity toggle)

### 4.9 Theme Toggle
- Hover: `scale(1.15) rotate(15deg)`

### 4.10 Empty State
- Animation: `fadeIn 0.3s ease`
- Padding: `2.5rem 1rem` (up from 2rem)

### 4.11 Edit Input
- Border: `1.5px solid var(--accent)` (up from 1px)
- Focus ring: `box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15)`

### 4.12 App Container
- Max width: `520px` (up from 480px)

## 5. Responsive

```css
@media (max-width: 480px) {
  body { padding: 1rem 0.75rem; }
  .app { max-width: 100%; }
  h1 { font-size: 1.5rem; }
  .todo-item { padding: 0.75rem 1rem; }
}
```

## 6. No JS Changes

No functions modified. No exports changed. No tests affected. All 63 existing tests remain green.