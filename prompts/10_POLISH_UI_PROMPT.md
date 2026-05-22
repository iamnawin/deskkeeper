# Prompt: Polish DeskKeeper UI

Polish the DeskKeeper UI to feel like a premium desktop control tower.

## Design Direction

See `DESIGN_SYSTEM.md` for full spec. Key principles:
- Dark background (`#0f1117`)
- Clean cards with subtle borders
- Calm status colors (amber, red, blue, green, gray)
- No childish AI robot style
- No excessive gradients or glow effects
- Professional productivity tool
- Fast, readable layout

## Screens to Polish

### 1. Dashboard
- Summary metric cards in a 4-column row
- Task cards with left-border color per status
- Group headers (Needs Attention / Running / Completed / Idle)
- Empty state per group when empty
- Loading state while data fetches

### 2. Watched Windows
- Search/filter bar
- Table with: App, Title, Status, Last Seen, Watch action
- Empty state for no watched windows
- Unwatch button for watched windows

### 3. Rules
- Grouped by status category
- Rule label, keyword chips, suggested action
- Read-only in MVP with "Edit coming soon" note

### 4. Settings
- Clean section groupings with dividers
- Toggle switches for boolean settings
- Number inputs for intervals/cooldowns
- Destructive action (Clear Data) styled in red with confirmation

### 5. Onboarding
- Clean step-by-step flow
- Privacy statement prominently placed
- Window selection step

## Additional Polish

- Empty states with icon + message + CTA
- Loading skeletons for async data
- Status filter tabs on Dashboard (All / Waiting / Running / etc.)
- Compact task card option (reduced padding)
- Hover states on all interactive elements
- Consistent 4px base spacing

## Rules

- Keep it practical — not a landing page
- All polish should improve clarity and usability
- No new features — visual polish only
