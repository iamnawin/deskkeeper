# Design System

## Visual Direction

Dark. Professional. Calm. Control tower aesthetic.

Not:
- Toy-like AI robot branding
- Excessive neon or glowing effects
- Landing-page gradients
- Childish animations
- Over-designed onboarding

---

## Color Palette

| Token | Purpose | Hex |
|---|---|---|
| `bg-base` | App background | `#0f1117` |
| `bg-surface` | Card surface | `#1a1d27` |
| `bg-elevated` | Elevated surface (sidebar) | `#14172 0` |
| `border` | Default border | `#2a2d3a` |
| `text-primary` | Primary text | `#e8eaf0` |
| `text-secondary` | Secondary/muted text | `#8b8fa8` |
| `text-dim` | Timestamps, labels | `#5a5d70` |
| `status-waiting` | WAITING_FOR_USER | `#f59e0b` (amber) |
| `status-failed` | FAILED | `#ef4444` (red) |
| `status-running` | RUNNING | `#3b82f6` (blue) |
| `status-completed` | COMPLETED | `#22c55e` (green) |
| `status-idle` | IDLE | `#6b7280` (gray) |
| `status-unknown` | UNKNOWN | `#374151` (dark gray) |
| `status-snoozed` | SNOOZED | `#8b5cf6` (purple) |
| `accent` | Interactive elements | `#6366f1` (indigo) |

---

## Typography

| Token | Usage | Size | Weight |
|---|---|---|---|
| `heading-lg` | Screen titles | 18px | 600 |
| `heading-md` | Card titles | 15px | 600 |
| `body` | Body text | 13px | 400 |
| `label` | Labels, badges | 11px | 500 |
| `mono` | Window titles, paths | 12px | 400 (monospace) |

Font family: System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

---

## Spacing

Base unit: 4px.  
Common values: 4, 8, 12, 16, 24, 32, 48px.  
Use Tailwind spacing scale (`p-2`, `p-4`, `p-6`, etc.).

---

## Components

### StatusBadge
- Pill shape
- Text: status label (SHORT_FORM)
- Background: 15% opacity of status color
- Text: status color
- Border: 1px status color at 40% opacity

### TaskCard
- Background: `bg-surface`
- Border: `border` (1px)
- Border-left: 3px status color
- Rounded: 6px
- Padding: 16px

### SummaryMetricCard
- Background: `bg-elevated`
- Large number (24px, bold)
- Label below (12px, muted)
- Icon top-right (24px, status color)

### Sidebar
- Background: `bg-elevated`
- Width: 200px
- Active item: left accent bar + text `text-primary`
- Inactive item: `text-secondary`

---

## Dark Mode

DeskKeeper is dark-mode only. No light mode in MVP.

---

## Icon Set

Use [Lucide Icons](https://lucide.dev/) — clean, minimal, consistent with the professional aesthetic.
