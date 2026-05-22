# Prompt: Build DeskKeeper Electron MVP Foundation

Build the initial DeskKeeper AI desktop app foundation.

## Stack

- Electron
- React + TypeScript
- Vite (via electron-vite)
- Tailwind CSS

## Directory

Create under `/app` in this repo.

## Requirements

1. Create Electron main process (`src/main/index.ts`)
2. Create preload script (`src/preload/index.ts`) with contextBridge
3. Create React renderer app (`src/renderer/main.tsx`, `App.tsx`)
4. Configure Tailwind CSS with dark theme defaults
5. Create dark control-tower layout component (`Layout.tsx`, `Sidebar.tsx`, `TopBar.tsx`)

### Screens (all with mock data)

- `Dashboard.tsx` — task cards grouped by status, summary metric cards
- `WatchedWindows.tsx` — list of open windows with watch/unwatch button
- `Rules.tsx` — detection rules list (read-only)
- `Settings.tsx` — notification toggles, privacy settings

### Components to Create

- `TaskCard.tsx` — title, app name, status badge, detected reason, suggested action, last seen, action buttons
- `StatusBadge.tsx` — colored pill badge per TaskStatus
- `SummaryMetricCard.tsx` — count card (Needs Attention / Running / Completed / Idle)
- `WindowCard.tsx` — window list item with watch button
- `EmptyState.tsx` — empty placeholder for empty lists

### Mock Data

Create `src/renderer/lib/mock-data.ts` with realistic task cards and windows.

### Shared Types

Create `src/shared/types.ts` with all interfaces from `DATA_MODEL.md`.

---

## After Implementation

Explain:
1. Files created
2. How to run locally (`npm install && npm run dev`)
3. Current limitations
4. Next step (Phase 2: real window monitor)

---

## Rules

- No real window monitoring yet — mock data only
- Keep code modular
- Follow `CLAUDE.md` coding rules
- Dark mode only — use design tokens from `DESIGN_SYSTEM.md`
