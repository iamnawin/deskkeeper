# Prompt: Build DeskKeeper Task Dashboard

Improve the DeskKeeper dashboard into a real control tower view.

## Requirements

### Task States to Support

```typescript
type TaskStatus =
  | 'UNKNOWN' | 'ACTIVE' | 'RUNNING' | 'WAITING_FOR_USER'
  | 'FAILED' | 'COMPLETED' | 'IDLE' | 'SNOOZED' | 'DONE' | 'IGNORED';
```

### Components

**TaskCard** (`src/renderer/components/TaskCard.tsx`)
- task title
- app/window name
- current status badge
- detected reason
- last seen time
- suggested next action
- buttons: Focus, Snooze, Done, Ignore
- Left border color matches status

**StatusBadge** (`src/renderer/components/StatusBadge.tsx`)
- Pill shape
- Color per status (see `DESIGN_SYSTEM.md`)
- Short label text

**SummaryMetricCard** (`src/renderer/components/SummaryMetricCard.tsx`)
- Large number
- Label
- Icon
- Color per category

### Dashboard Layout

Group task cards by:
1. Needs Attention (WAITING_FOR_USER + FAILED)
2. Running
3. Completed
4. Idle / Unknown
5. Snoozed (collapsed)

### Action Handlers

- **Focus**: Call IPC to focus the watched window
- **Snooze**: Prompt for duration → update task state to SNOOZED
- **Done**: Update task state to DONE, remove from active view
- **Ignore**: Update task state to IGNORED, remove from active view

## Rules

- Use mock data if detection engine not yet connected
- Keep styling dark and professional (see `DESIGN_SYSTEM.md`)
- No AI yet
