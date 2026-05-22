# Product Requirements

## Business Requirements

1. DeskKeeper must function fully without cloud connectivity (local-first).
2. DeskKeeper must not store or transmit user data externally without explicit consent.
3. DeskKeeper must be installable on Windows as a standalone desktop app.
4. DeskKeeper must be usable by a non-technical user after initial onboarding.
5. The detection engine must work without an AI model (rule-based fallback always available).
6. The product must not auto-click or auto-approve anything without explicit user action.

---

## User Requirements

1. I can see what windows are currently open on my desktop.
2. I can choose which windows to watch.
3. I can see watched windows as task cards in a dashboard.
4. Each task card shows the current state, why it was detected, and what I should do next.
5. I receive a desktop notification when a watched task needs my attention.
6. I can snooze a task, mark it done, or ignore it.
7. My watched windows and task states persist across app restarts.
8. I can pause monitoring at any time.
9. I can enable private mode to stop all monitoring.
10. I can configure which notification types I receive.
11. I can add windows to an exclusion list.

---

## MVP Acceptance Criteria

| # | Criterion | Test |
|---|---|---|
| 1 | App launches on Windows without errors | Launch from installer or `npm run dev` |
| 2 | Open windows are visible in Watched Windows screen | See real or mock window list |
| 3 | User can click "Watch" on a window | Window appears as task card on dashboard |
| 4 | Task card shows a detected state | WAITING_FOR_USER / RUNNING / FAILED / COMPLETED / IDLE / UNKNOWN |
| 5 | Desktop notification appears for WAITING_FOR_USER | Trigger by title keyword match |
| 6 | Desktop notification appears for FAILED | Trigger by title keyword match |
| 7 | Snooze action defers the task | Card moves to snoozed state, re-surfaces after interval |
| 8 | Mark Done removes card from active view | Card moves to done state |
| 9 | Ignore suppresses card | Card moves to ignored state |
| 10 | State persists after app restart | Reopen app — watched windows and states are restored |
| 11 | Private mode pauses monitoring | Toggle private mode — monitoring stops, no notifications |
| 12 | No screenshots sent to cloud | Verify no outbound network calls in MVP |
