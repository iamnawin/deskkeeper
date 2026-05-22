# Functional Requirements

## FR-01: Open Window Listing

- The app must list currently open windows on the user's desktop.
- Each window entry must include: window title, app/process name, and last seen timestamp.
- If native OS window listing is not available or too complex, a mock fallback must exist.
- The list must refresh at a configurable interval (default: 10 seconds).

## FR-02: Watch / Unwatch Windows

- User must be able to select any open window and mark it as "watched."
- Watched state must persist across app restarts.
- User must be able to unwatch a window from the watched list.
- Watched windows must be stored in local storage.

## FR-03: Task Cards

- Each watched window must generate a task card.
- Task card must display:
  - Title
  - App / window name
  - Status badge (current state)
  - Detected reason (why this state was assigned)
  - Suggested action (what the user should do)
  - Last seen timestamp
  - Action buttons: Focus, Snooze, Done, Ignore
- Task cards must be grouped by status category on the dashboard.

## FR-04: Rule-Based State Detection

- The detection engine must classify watched windows into states:
  `UNKNOWN | RUNNING | WAITING_FOR_USER | FAILED | COMPLETED | IDLE`
- Detection inputs: window title, app name, visible text (if available), previous state, last activity timestamp.
- Detection must use configurable keyword rules.
- Detection must return: status, confidence, detectedReason, suggestedAction, matchedRules.
- If confidence is low, return `UNKNOWN`. Avoid false positives.

## FR-05: Desktop Notifications

- Notifications must fire when a task enters `WAITING_FOR_USER` or `FAILED`.
- Notifications may fire when a task enters `COMPLETED` (if user setting enabled).
- Notifications must not repeat for the same task + state within the cooldown window (default: 5 minutes).
- Notification must show: title, app name, status, suggested action.
- Clicking notification must bring DeskKeeper app into focus.

## FR-06: Task Actions

- **Snooze**: Defer the task. Re-surface after snooze duration. Status becomes `SNOOZED`.
- **Mark Done**: Mark as complete. Status becomes `DONE`. Remove from active view.
- **Ignore**: Suppress permanently. Status becomes `IGNORED`. Remove from active view.
- **Focus**: Bring the watched window into focus (if possible).

## FR-07: Settings

- Enable/disable all notifications
- Per-type toggles: notify on waiting / failed / completed
- Notification cooldown (minutes)
- Capture interval (seconds)
- Private mode toggle
- Pause monitoring toggle
- AI classifier toggle (disabled by default)
- App exclusion list

## FR-08: Local Storage

- All data stored locally using electron-store.
- Stored entities: WatchedWindow, TaskCard, UserSettings, NotificationEvent, DetectionRule.
- User must be able to clear all local data from settings.
- Storage must be migration-friendly for future schema changes.

## FR-09: Privacy Controls

- Private mode: pauses all monitoring, no notifications.
- App exclusion list: specific apps never monitored.
- Monitoring pause: global toggle on dashboard.
- Visible indicator: user must always see when monitoring is active.
- No screenshots sent externally without explicit user consent.

## FR-10: Onboarding

- First-launch onboarding screen explaining what DeskKeeper does.
- Prompt user to select initial windows to watch.
- Explain privacy controls before monitoring starts.
- Let user configure basic notification preferences.
