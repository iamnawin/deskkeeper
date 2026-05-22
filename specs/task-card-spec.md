# Task Card Spec

## Purpose

A TaskCard is the primary unit of the DeskKeeper UI. It represents one watched window and its current state.

## Data

```typescript
interface TaskCard {
  id: string;
  windowId: string;
  title: string;
  appName?: string;
  status: TaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedReason?: string;
  suggestedAction?: string;
  lastSeenAt: string;
  lastStateChangeAt: string;
  snoozedUntil?: string;
  isIgnored?: boolean;
  isDone?: boolean;
}
```

## Visual Layout

```
┌─────────────────────────────────────────────────────┐  ← left border: status color
│ [STATUS BADGE]  Window Title                        │
│                 App Name · Last seen: 2 min ago     │
│                                                     │
│ Detected: "Waiting for approval in window title"    │
│ Suggested: Review and provide input.                │
│                                                     │
│ [Focus]  [Snooze ▼]  [Done ✓]  [Ignore ✕]         │
└─────────────────────────────────────────────────────┘
```

## Status Badge Colors

| Status | Color |
|---|---|
| WAITING_FOR_USER | Amber (#f59e0b) |
| FAILED | Red (#ef4444) |
| RUNNING | Blue (#3b82f6) |
| COMPLETED | Green (#22c55e) |
| IDLE | Gray (#6b7280) |
| UNKNOWN | Dark gray (#374151) |
| SNOOZED | Purple (#8b5cf6) |

## Actions

| Action | Behavior |
|---|---|
| Focus | IPC call to focus the watched window |
| Snooze | Dropdown: 5 min / 15 min / 30 min / 1 hour → state = SNOOZED |
| Done | state = DONE, removed from active view |
| Ignore | state = IGNORED, removed from active view |

## Grouping on Dashboard

Cards are grouped by status category:
1. Needs Attention (WAITING_FOR_USER, FAILED)
2. Running
3. Completed
4. Idle / Unknown
5. Snoozed (collapsed section)

DONE and IGNORED cards are not shown in main dashboard. Available in Archive (future).
