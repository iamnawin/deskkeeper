# Notification Strategy

## When to Notify

| Condition | Default |
|---|---|
| Task enters `WAITING_FOR_USER` | Always (if notifications enabled) |
| Task enters `FAILED` | Always (if notifications enabled) |
| Task enters `COMPLETED` | Optional (user setting, default: off) |
| Task remains `IDLE` beyond threshold | Optional (user setting, default: off) |

---

## When NOT to Notify

- Same task, same state, within the cooldown window (default: 5 minutes)
- Monitoring is paused
- Private mode is enabled
- Task is `SNOOZED`, `DONE`, or `IGNORED`
- Notifications are globally disabled in settings

---

## Notification Content

Each notification includes:
- **Title**: Task/window name
- **Body**: Status + suggested action

**Examples:**

> **Codex — PowerShell**  
> Waiting for your approval. Click to review.

> **Vercel Dashboard**  
> Deployment failed. Review build logs.

> **Gmail — Compose**  
> Email draft is still unsent.

> **Runway — Video Export**  
> Render completed. Download is ready.

---

## Cooldown Logic

Per-task, per-status cooldown:
- Track `lastNotifiedAt` per `taskId + status` pair
- Only fire if `now - lastNotifiedAt > cooldownMinutes * 60 * 1000`
- Default cooldown: 5 minutes
- User-configurable in Settings

This prevents notification spam when a window title repeatedly cycles through the same state.

---

## Notification Actions (MVP)

MVP notification behavior on click:
- Bring the DeskKeeper app window into focus

**Future notification actions (post-MVP):**
- Focus the watched window directly
- Snooze from notification
- Mark done from notification
- Ignore from notification

---

## Implementation

Use Electron's built-in Notification API:

```typescript
new Notification({
  title: taskCard.title,
  body: `${statusLabel} — ${taskCard.suggestedAction}`,
}).show();
```

No third-party notification libraries required for MVP.

---

## Notification History

All fired notifications are stored locally as `NotificationEvent[]` in `electron-store`. Visible in Settings > Notification History (future screen). Not synced to cloud.

---

## Platform Behavior

On Windows, Electron notifications appear as native Windows toast notifications. Clicking the notification brings the Electron app into focus via `mainWindow.focus()`.
