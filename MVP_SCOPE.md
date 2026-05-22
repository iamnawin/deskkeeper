# MVP Scope — DeskKeeper Lite (v0.1)

## MVP Goal

Deliver a working Windows desktop app that:
1. Shows open windows
2. Lets the user watch selected windows
3. Turns watched windows into task cards
4. Detects basic task states using rule-based logic
5. Sends desktop notifications when attention is needed
6. Lets users snooze, mark done, or ignore tasks
7. Stores state locally

---

## Included in MVP

### Desktop App Shell
- Electron + React + TypeScript + Vite + Tailwind CSS
- Dark control-tower dashboard
- Sidebar navigation

### Window Listing
- List currently open windows (with mock fallback if native is complex)
- Show: app name, window title, last seen
- Let user click "Watch" on any window

### Task Cards
- Watched windows become task cards
- Task card fields: title, app name, status, detected reason, suggested action, last seen, action buttons
- Status states: `WAITING_FOR_USER` | `RUNNING` | `FAILED` | `COMPLETED` | `IDLE` | `UNKNOWN`
- Actions: Focus, Snooze, Mark Done, Ignore

### Detection Engine
- Rule-based keyword matching on window title and visible text
- Categories: WAITING_FOR_USER, FAILED, COMPLETED, RUNNING, IDLE, UNKNOWN
- Configurable rules in `detection-rules.ts`

### Notifications
- Desktop notifications via Electron Notification API
- Triggers: WAITING_FOR_USER, FAILED, COMPLETED (optional)
- Debounce: no repeat notification for same task/state within cooldown
- Default cooldown: 5 minutes

### Local Storage
- `electron-store` for MVP
- Stores: watched windows, task cards, settings, notification history, snoozed/done/ignored states

### Settings
- Enable/disable notifications
- Notify on: waiting / failed / completed (toggles)
- Notification cooldown (minutes)
- Private mode toggle
- Pause monitoring toggle
- AI classifier toggle (disabled/off by default)

### Privacy Controls
- User explicitly selects windows to watch
- Private mode pauses all monitoring
- Visible indicator when monitoring is active

---

## Excluded from MVP

| Feature | Reason |
|---|---|
| Auto-clicking / auto-approval | Core boundary — watch only |
| Cloud screenshot upload | Privacy — local-first |
| Real OCR | Complexity — add as Phase 2 abstraction |
| Chrome extension | Companion only — desktop app comes first |
| AI classifier | Optional — rule engine works without it |
| Team collaboration | Future phase |
| Mobile app | Out of scope |
| User accounts | Not needed for local-first MVP |
| Cloud sync | Out of scope |
| Enterprise admin | Future |
| Paid subscription logic | Post-MVP |

---

## MVP Success Criteria

1. App launches without errors on Windows
2. User can see a list of open windows (or mock fallback)
3. User can watch a window — it appears as a task card
4. Task card shows a detected state based on window title
5. Desktop notification appears when a task enters WAITING_FOR_USER or FAILED
6. User can snooze, mark done, or ignore a task
7. State persists across app restarts
8. No screenshots sent to cloud
9. Monitoring pauses when private mode is enabled
