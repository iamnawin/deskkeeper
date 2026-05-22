# Data Model

All TypeScript interfaces. Defined in `app/src/shared/types.ts`.

---

## TaskStatus

```typescript
export type TaskStatus =
  | 'UNKNOWN'
  | 'ACTIVE'
  | 'RUNNING'
  | 'WAITING_FOR_USER'
  | 'FAILED'
  | 'COMPLETED'
  | 'IDLE'
  | 'SNOOZED'
  | 'DONE'
  | 'IGNORED';
```

---

## WatchedWindow

```typescript
export interface WatchedWindow {
  id: string;
  sourceId?: string;
  title: string;
  appName?: string;
  processName?: string;
  monitorName?: string;
  isWatched: boolean;
  createdAt: string;       // ISO 8601
  lastSeenAt: string;      // ISO 8601
}
```

---

## TaskCard

```typescript
export interface TaskCard {
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

---

## DetectionInput

```typescript
export interface DetectionInput {
  windowId: string;
  windowTitle: string;
  appName?: string;
  visibleText?: string;
  previousStatus?: TaskStatus;
  lastActivityAt?: string;
  now: string;             // ISO 8601
}
```

---

## DetectionResult

```typescript
export interface DetectionResult {
  status: TaskStatus;
  confidence: number;       // 0.0 – 1.0
  detectedReason: string;
  suggestedAction: string;
  matchedRules: string[];
}
```

---

## DetectionRule

```typescript
export interface DetectionRule {
  id: string;
  label: string;
  status: TaskStatus;
  keywords: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedAction: string;
}
```

---

## NotificationEvent

```typescript
export interface NotificationEvent {
  id: string;
  taskId: string;
  status: TaskStatus;
  title: string;
  body: string;
  createdAt: string;
  clickedAt?: string;
}
```

---

## UserSettings

```typescript
export interface UserSettings {
  notificationsEnabled: boolean;
  notifyOnWaiting: boolean;
  notifyOnFailed: boolean;
  notifyOnCompleted: boolean;
  notificationCooldownMinutes: number;   // default: 5
  privateModeEnabled: boolean;
  monitoringPaused: boolean;
  useAiClassifier: boolean;              // default: false
  captureIntervalSeconds: number;        // default: 10
}
```

---

## StorageSchema

```typescript
export interface StorageSchema {
  watchedWindows: WatchedWindow[];
  taskCards: TaskCard[];
  notificationHistory: NotificationEvent[];
  settings: UserSettings;
  detectionRules: DetectionRule[];
}
```
