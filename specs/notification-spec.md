# Notification Spec

## Trigger Conditions

| Event | Notify? | Controlled by |
|---|---|---|
| Task → WAITING_FOR_USER | Yes (default on) | `notifyOnWaiting` |
| Task → FAILED | Yes (default on) | `notifyOnFailed` |
| Task → COMPLETED | Optional (default off) | `notifyOnCompleted` |
| Task → IDLE beyond threshold | Future | (future setting) |

## Cooldown

- Per task ID + status combination
- Default cooldown: 5 minutes
- Track `lastNotifiedAt[taskId + status]`
- Only fire if `now - lastNotifiedAt > cooldownMs`

## Notification Content

```
Title: {task.title}
Body:  {statusLabel(task.status)} — {task.suggestedAction}
```

Example:
```
Title: PowerShell — Claude Code
Body:  Waiting for input — Review and provide approval.
```

## On Click

MVP: `mainWindow.focus()` — bring DeskKeeper app to foreground.

Future: Navigate to the specific task card in the dashboard.

## Storage

Each fired notification is stored:
```typescript
{
  id: uuid(),
  taskId: string,
  status: TaskStatus,
  title: string,
  body: string,
  createdAt: ISO8601,
  clickedAt?: ISO8601
}
```

## Guard Conditions — Do NOT Notify If

- `settings.notificationsEnabled === false`
- `settings.monitoringPaused === true`
- `settings.privateModeEnabled === true`
- `task.isIgnored === true`
- `task.isDone === true`
- `task.status === 'SNOOZED'`
- Cooldown has not elapsed
