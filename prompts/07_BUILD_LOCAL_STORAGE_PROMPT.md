# Prompt: Build Local Storage Layer

Add a complete local storage layer for DeskKeeper.

## Library

Use `electron-store` for MVP.

## File to Create

`src/main/services/storage-service.ts`

## StorageSchema

```typescript
interface StorageSchema {
  watchedWindows: WatchedWindow[];
  taskCards: TaskCard[];
  notificationHistory: NotificationEvent[];
  settings: UserSettings;
  detectionRules: DetectionRule[];
}
```

## Requirements

1. Create a typed `StorageService` class wrapping `electron-store`
2. Provide typed methods:
   - `getWatchedWindows()` / `saveWatchedWindow()` / `removeWatchedWindow()`
   - `getTaskCards()` / `saveTaskCard()` / `updateTaskCard()` / `removeTaskCard()`
   - `getSettings()` / `saveSettings()`
   - `addNotificationEvent()`
   - `getDetectionRules()` / `saveDetectionRules()`
   - `clearAll()` (for settings reset)
3. Initialize with default values on first run (default settings, default rules)
4. All operations are synchronous (electron-store is sync)
5. Storage file lives in user's AppData folder (Electron default)

## Default Settings

```typescript
const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  notifyOnWaiting: true,
  notifyOnFailed: true,
  notifyOnCompleted: false,
  notificationCooldownMinutes: 5,
  privateModeEnabled: false,
  monitoringPaused: false,
  useAiClassifier: false,
  captureIntervalSeconds: 10,
};
```

## Rules

- Local-first only — no cloud sync
- No unencrypted sensitive data
- Migration-friendly: use schema versioning field
- `clearAll()` must be accessible from Settings screen via IPC

## After Implementation

Explain:
1. Storage file location on disk
2. How to inspect storage during development
3. How to reset storage for testing
4. Migration strategy for future schema changes
