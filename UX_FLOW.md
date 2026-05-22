# UX Flow

## First Launch — Onboarding

```
App launches for first time
  → Onboarding screen shown
  → "Welcome to DeskKeeper" — one-sentence explanation
  → Privacy explanation: "DeskKeeper only watches windows you choose."
  → Notification permission request
  → "Pick your first windows to watch" — window list shown
  → User selects 1–3 windows
  → "Start Monitoring" button
  → Dashboard shown
```

---

## Daily Use — Dashboard Flow

```
User opens DeskKeeper (or it was already running in tray)
  → Dashboard shows task cards grouped by state
  → "Needs Attention" group shown first
  → User scans cards
  → User clicks "Focus" on a card → watched window brought to foreground
  → User clicks "Snooze" → task deferred, snooze dialog asks duration
  → User clicks "Done" → task removed from active view
  → User clicks "Ignore" → task suppressed permanently
```

---

## Watching a New Window

```
User navigates to "Watched Windows" tab
  → Open windows list shown (or mock list)
  → User finds a window to watch
  → Clicks "Watch" button on that window
  → Window added to watched list
  → Task card created on Dashboard
  → Detection runs on next cycle
```

---

## Notification Flow

```
Detection engine runs on monitoring interval
  → Task enters WAITING_FOR_USER or FAILED
  → Cooldown check passes
  → Desktop notification fires
  → User sees toast notification
  → User clicks notification
  → DeskKeeper app brought to focus
  → Dashboard shown with task card highlighted
  → User takes action (Focus / Snooze / Done / Ignore)
```

---

## Snooze Flow

```
User clicks "Snooze" on a task card
  → Snooze dialog: "Remind me in: 5 min / 15 min / 30 min / 1 hour"
  → User selects duration
  → Task state → SNOOZED
  → Card moves to Snoozed section (or hidden)
  → After snooze duration expires on next monitoring cycle
  → Task state reverts to WAITING_FOR_USER
  → Notification fires if settings allow
```

---

## Settings Flow

```
User navigates to Settings tab
  → Notification settings visible
  → Toggle notifications on/off
  → Per-type toggles: waiting / failed / completed
  → Cooldown duration slider/input
  → Private mode toggle
  → Pause monitoring toggle
  → AI classifier toggle (disabled by default)
  → Clear local data option
```

---

## Private Mode Flow

```
User clicks "Private Mode" button on Dashboard header
  → Monitoring immediately stops
  → All task card states frozen
  → No new notifications
  → Tray icon changes to indicate private mode
  → Dashboard shows "Private Mode Active" banner
  → User clicks "Resume Monitoring" to exit
  → Monitoring restarts
  → Detection resumes from current window states
```

---

## Window Closed / Unavailable Flow

```
Watched window is closed by user
  → window-monitor-service no longer finds the sourceId
  → Task card shows "Window no longer available"
  → Status → UNKNOWN
  → No notification (no actionable state)
  → Card remains until user removes it or marks done
```
