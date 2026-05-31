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
  | 'IGNORED'

export interface WatchedWindow {
  id: string
  sourceId?: string
  title: string
  appName?: string
  processName?: string
  monitorName?: string
  isWatched: boolean
  createdAt: string
  lastSeenAt: string
}

export interface TaskCard {
  id: string
  windowId: string
  title: string
  appName?: string
  status: TaskStatus
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  detectedReason?: string
  suggestedAction?: string
  lastSeenAt: string
  lastStateChangeAt: string
  // Last tick the window's title changed — used to detect frozen/hung work.
  // Distinct from lastStateChangeAt, which only moves on a status transition.
  lastActivityAt?: string
  snoozedUntil?: string
  isIgnored?: boolean
  isDone?: boolean
}

export interface DetectionInput {
  windowId: string
  windowTitle: string
  appName?: string
  visibleText?: string
  previousStatus?: TaskStatus
  lastActivityAt?: string
  now: string
}

export interface DetectionResult {
  status: TaskStatus
  confidence: number
  detectedReason: string
  suggestedAction: string
  matchedRules: string[]
}

export interface DetectionRule {
  id: string
  label: string
  status: TaskStatus
  keywords: string[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  suggestedAction: string
}

export interface NotificationEvent {
  id: string
  taskId: string
  status: TaskStatus
  title: string
  body: string
  createdAt: string
  clickedAt?: string
}

export interface UserSettings {
  notificationsEnabled: boolean
  notifyOnWaiting: boolean
  notifyOnFailed: boolean
  notifyOnCompleted: boolean
  notificationCooldownMinutes: number
  privateModeEnabled: boolean
  monitoringPaused: boolean
  useAiClassifier: boolean
  captureIntervalSeconds: number
  // Minutes an in-progress (RUNNING) window may show no title change before it
  // is treated as stalled/hung and surfaced as WAITING_FOR_USER.
  staleThresholdMinutes: number
  // Start DeskKeeper automatically when the user logs in (packaged builds only).
  launchOnLogin: boolean
}

export interface StorageSchema {
  watchedWindows: WatchedWindow[]
  taskCards: TaskCard[]
  notificationHistory: NotificationEvent[]
  settings: UserSettings
  detectionRules: DetectionRule[]
}
