# UI Screen Specifications

## Global Layout

```
┌─────────────────────────────────────────────────────┐
│  TopBar: DeskKeeper   [● Monitoring Active]  [⏸]   │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  Main Content Area                       │
│          │                                          │
│ Dashboard│                                          │
│ Windows  │                                          │
│ Rules    │                                          │
│ Settings │                                          │
│          │                                          │
│ ──────   │                                          │
│ Pause    │                                          │
│ Private  │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## Screen 1: Dashboard

**Purpose**: Primary control tower view. Shows what needs attention.

**Summary metrics row:**
```
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ ⚠ Needs    │ │ ▶ Running  │ │ ✓ Completed│ │ ⏸ Idle /  │
│ Attention  │ │            │ │            │ │   Unknown  │
│   3        │ │   2        │ │   1        │ │   4        │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

**Task card groups:**
- Needs Attention (WAITING_FOR_USER + FAILED)
- Running
- Completed
- Idle / Unknown
- Snoozed (collapsed by default)

**Task Card:**
```
┌─────────────────────────────────────────────────────┐
│ [⚠ WAITING]  PowerShell — Claude Code               │
│              app: Windows Terminal                   │
│ Detected: "Waiting for approval" in window title     │
│ Suggested: Review and provide input.                 │
│ Last seen: 2 min ago                                 │
│                                                      │
│ [Focus]  [Snooze ▼]  [Done]  [Ignore]               │
└─────────────────────────────────────────────────────┘
```

**Status badge colors:**
- `WAITING_FOR_USER`: amber / yellow
- `FAILED`: red
- `RUNNING`: blue
- `COMPLETED`: green
- `IDLE`: gray
- `UNKNOWN`: dark gray
- `SNOOZED`: purple

---

## Screen 2: Watched Windows

**Purpose**: View all open windows and manage which ones are watched.

**Layout:**
- Search/filter bar at top
- Table or card list of windows
- Columns: App Name, Window Title, Status, Last Seen, Watch toggle

```
┌──────────────────────────────────────────────────┐
│ Search windows...                                │
├──────────┬────────────────────────┬──────────────┤
│ App      │ Title                  │ Action       │
├──────────┼────────────────────────┼──────────────┤
│ Terminal │ Claude Code — main     │ [● Watching] │
│ Chrome   │ Vercel Dashboard       │ [Watch]      │
│ VS Code  │ project/src/app.ts     │ [Watch]      │
│ Chrome   │ Gmail — Compose        │ [Watch]      │
└──────────┴────────────────────────┴──────────────┘
```

---

## Screen 3: Rules

**Purpose**: View detection rules. Edit in future.

**Layout:**
- Rule list grouped by status category
- Each rule shows: label, keywords, priority, suggested action
- MVP: read-only, edit button disabled (coming soon)

---

## Screen 4: Settings

**Purpose**: Configure monitoring, notifications, privacy.

**Sections:**

**Notifications**
- [ ] Enable notifications
- [ ] Notify when waiting for input
- [ ] Notify when task fails
- [ ] Notify when task completes
- Cooldown: [5] minutes

**Monitoring**
- [ ] Pause monitoring
- [ ] Private mode
- Capture interval: [10] seconds

**AI**
- [ ] Use AI for ambiguous detection (disabled by default)

**Data**
- [Clear all local data]

---

## Screen 5: Onboarding

**Purpose**: First-run setup.

**Steps:**
1. Welcome screen — what DeskKeeper does (2–3 sentences)
2. Privacy statement — what is and isn't monitored
3. Notification permission request
4. Select initial windows to watch
5. Done — go to Dashboard
