# Prompt: Build Notification System

Add desktop notifications for DeskKeeper.

## File to Create

`src/main/services/notification-service.ts`

## Requirements

1. Fire desktop notifications using Electron's `Notification` API (no third-party libs)
2. Notify when a task enters:
   - `WAITING_FOR_USER` (always, if notifications enabled)
   - `FAILED` (always, if notifications enabled)
   - `COMPLETED` (optional — user setting)
3. Debounce logic:
   - Track `lastNotifiedAt` per `taskId + status` pair
   - Only fire if `now - lastNotifiedAt > cooldownMs`
   - Default cooldown: 5 minutes
4. Notification content:
   - Title: task/window title
   - Body: status label + suggested action
5. On notification click: bring DeskKeeper app window to focus via `mainWindow.focus()`
6. Store all fired notifications as `NotificationEvent[]` in local storage

## Settings Integration

Respect these `UserSettings` fields:
- `notificationsEnabled`
- `notifyOnWaiting`
- `notifyOnFailed`
- `notifyOnCompleted`
- `notificationCooldownMinutes`
- `monitoringPaused`
- `privateModeEnabled`

Do NOT notify when monitoring is paused or private mode is active.

## Rules

- No cloud push notifications
- No third-party notification libraries
- Notification history stored locally only
- Do not add auto-actions to notifications in MVP (click-to-focus only)

## After Implementation

Explain:
1. Debounce strategy used
2. How to test notifications locally
3. Settings integration
4. Next step (Phase 5: local storage polish)
