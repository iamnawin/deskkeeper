# Task State Engine

## Supported States

| State | Meaning |
|---|---|
| `UNKNOWN` | App cannot confidently determine the state |
| `ACTIVE` | Window is active or recently interacted with |
| `RUNNING` | A process appears to be in progress |
| `WAITING_FOR_USER` | Window appears to need user action or input |
| `FAILED` | Window appears to show failure, error, conflict, or blocked state |
| `COMPLETED` | Task appears complete or ready for review |
| `IDLE` | Task has not changed for threshold — may be forgotten |
| `SNOOZED` | User postponed the task |
| `DONE` | User marked task done |
| `IGNORED` | User permanently suppressed this task/window |

---

## State Transitions

Valid transitions only. Invalid transitions should be rejected or logged.

```
UNKNOWN        → RUNNING, WAITING_FOR_USER, FAILED, COMPLETED, IDLE, ACTIVE
ACTIVE         → RUNNING, WAITING_FOR_USER, IDLE, UNKNOWN
RUNNING        → WAITING_FOR_USER, COMPLETED, FAILED, IDLE
WAITING_FOR_USER → RUNNING, SNOOZED, DONE, IGNORED, UNKNOWN
FAILED         → RUNNING, DONE, IGNORED
COMPLETED      → DONE, RUNNING (re-triggered)
IDLE           → WAITING_FOR_USER, DONE, IGNORED, RUNNING
SNOOZED        → WAITING_FOR_USER (on snooze expiry), DONE, IGNORED
DONE           → (terminal — no further transitions)
IGNORED        → (terminal — no further transitions)
```

---

## State Assignment Logic

### Detection-driven transitions
The `detection-engine` classifies a window on each monitoring cycle and returns a `DetectionResult`. The `task-state-engine` decides whether to apply the new state based on:
- Confidence threshold (e.g., only apply state if confidence > 0.6)
- Valid transition check (from current state to new state)
- Cooldown (don't flip state repeatedly on noisy signals)

### User-driven transitions
User actions create direct state transitions:
- "Snooze" → `SNOOZED`
- "Mark Done" → `DONE`
- "Ignore" → `IGNORED`
- "Focus" → (no state change, just focuses the window)

---

## Idle Detection

A task enters `IDLE` when:
1. Current state is `RUNNING`, `ACTIVE`, or `UNKNOWN`
2. Window title has not changed for more than `idleThresholdMinutes` (configurable, default: 15)
3. Task is not already `SNOOZED`, `DONE`, or `IGNORED`

Idle tasks re-surface as `WAITING_FOR_USER` if the window title later matches a waiting keyword.

---

## Snooze Logic

When a user snoozes a task:
1. State → `SNOOZED`
2. `snoozedUntil` is set to `now + snoozeDurationMinutes`
3. Task is removed from the "Needs Attention" view
4. On next monitoring cycle after `snoozedUntil`, state reverts to `WAITING_FOR_USER`

---

## Terminal States

`DONE` and `IGNORED` are terminal states. Once set by the user, detection engine results are ignored for that task. The task is removed from the active dashboard view.

Users can un-ignore or un-done from the history/archive view (future feature).
