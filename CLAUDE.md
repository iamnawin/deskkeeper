# CLAUDE.md — DeskKeeper AI Working Instructions

You are working inside the DeskKeeper AI repo.

DeskKeeper AI is a desktop control tower for unfinished work across screens, apps, tabs, tools, uploads, drafts, forms, renders, terminals, meetings, deployments, and AI agents. The product goal is to help users recover attention across scattered work.

---

## Core Rule

Do not turn DeskKeeper into a generic AI assistant or autonomous click bot. The MVP should **observe, classify, and notify**. Nothing more.

---

## Product Boundaries

DeskKeeper **should**:
- Monitor user-selected windows
- Create task cards from watched windows
- Detect task states using rule-based detection
- Notify the user when attention is needed
- Let the user snooze / mark done / ignore
- Keep all data local-first
- Protect user privacy

DeskKeeper should **not** (in MVP):
- Auto-click anything
- Auto-approve anything
- Take over the desktop
- Upload screenshots to cloud
- Monitor all windows by default
- Require AI to work
- Require a Chrome extension to work

---

## Tech Stack

- **Runtime**: Electron
- **UI**: React + TypeScript + Vite + Tailwind CSS
- **Storage**: electron-store (MVP), SQLite later
- **Detection**: Rule-based first, OCR later, AI optional
- **Notifications**: Electron Notification API

---

## Architecture Rules

Keep modules small. Follow this structure:

```
app/src/
├── main/           Electron main process
│   ├── ipc/        IPC handlers
│   ├── services/   Business logic services
│   └── utils/      Utilities
├── preload/        Safe Electron-renderer bridge
├── renderer/       React UI
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
└── shared/         Shared TypeScript types and constants
```

---

## Expected Services

| Service | Responsibility |
|---|---|
| `window-monitor-service` | List open windows, track watched state |
| `capture-service` | Screenshot or visible-text capture (abstraction) |
| `detection-engine` | Classify window state from inputs |
| `task-state-engine` | Manage task state transitions |
| `notification-service` | Emit desktop notifications with debounce |
| `storage-service` | Read/write local storage |
| `settings-service` | Read/write user settings |

---

## Coding Rules

- Use TypeScript everywhere
- Define clear interfaces before implementation
- Avoid unnecessary dependencies
- Keep functions under 50 lines
- Prefer readable code over clever code
- Add comments only where the WHY is non-obvious
- If native OS implementation is hard, create a clean abstraction with a mock fallback
- Do not build beyond what the current task requires

---

## Privacy Rules

- User must explicitly choose windows to watch — no default monitoring
- No cloud upload of screenshots by default
- No sensitive data collection (passwords, card numbers)
- Private mode must pause all monitoring
- AI classifier must be disabled by default
- All detection processing is local unless user enables cloud AI

---

## Task States

```
UNKNOWN | ACTIVE | RUNNING | WAITING_FOR_USER | FAILED | COMPLETED | IDLE | SNOOZED | DONE | IGNORED
```

Use rule-based detection first. AI is optional later.

---

## UI Direction

Dark, clean, professional **control tower** aesthetic.

Avoid:
- Childish AI robot design
- Excessive neon or glow effects
- Landing-page style copy
- Over-designed animations

---

## How To Respond After Changes

Always tell the user:
1. What changed
2. Which files changed
3. Why the change was made
4. How to run / test it
5. What the next step should be

---

## Build Order

1. Documentation (current step)
2. Electron mock UI shell
3. Window monitor abstraction
4. Watched windows + task cards
5. Detection engine
6. Notifications
7. Local storage persistence
8. OCR abstraction (placeholder)
9. Chrome extension companion
10. Optional AI classifier
11. Packaging

---

## Source of Truth

All product decisions live in the markdown files at the root of this repo. When in doubt, read those files before coding.
