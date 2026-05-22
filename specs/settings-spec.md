# Settings Spec

## Settings Schema

```typescript
interface UserSettings {
  notificationsEnabled: boolean;        // default: true
  notifyOnWaiting: boolean;             // default: true
  notifyOnFailed: boolean;              // default: true
  notifyOnCompleted: boolean;           // default: false
  notificationCooldownMinutes: number;  // default: 5
  privateModeEnabled: boolean;          // default: false
  monitoringPaused: boolean;            // default: false
  useAiClassifier: boolean;             // default: false
  captureIntervalSeconds: number;       // default: 10
}
```

## Settings Screen Sections

### Notifications
- Toggle: Enable notifications
- Toggle: Notify when waiting for input
- Toggle: Notify when task fails
- Toggle: Notify when task completes
- Input: Cooldown (minutes)

### Monitoring
- Toggle: Pause monitoring
- Toggle: Private mode
- Input: Capture interval (seconds)

### AI (Disabled by Default)
- Toggle: Use AI for ambiguous detection
- Text below: "When enabled, text snippets from window titles may be processed by an AI model."

### Data
- Button: Clear all local data (red, requires confirmation)
- Text: "Clears all watched windows, task cards, and notification history."

## IPC

```
settings:get → returns UserSettings
settings:save → accepts Partial<UserSettings>, merges with existing
settings:clear-all → clears entire storage
```

## Defaults

Applied on first launch or after clear:
- All notifications on except notifyOnCompleted
- Cooldown: 5 minutes
- Capture interval: 10 seconds
- AI: off
- Private mode: off
- Monitoring paused: false
