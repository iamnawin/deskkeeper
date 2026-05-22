import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import type { StorageSchema, WatchedWindow, TaskCard, DetectionRule, UserSettings } from '../../shared/types'

const DEFAULT_RULES: DetectionRule[] = [
  {
    id: 'rule-waiting',
    label: 'Waiting for User Input',
    status: 'WAITING_FOR_USER',
    keywords: ['waiting for user', 'input required', 'your turn', 'action required', 'confirm', 'waiting...'],
    priority: 'HIGH',
    suggestedAction: 'Check this window — it needs your attention.',
  },
  {
    id: 'rule-failed',
    label: 'Task Failed',
    status: 'FAILED',
    keywords: ['error', 'failed', 'failure', 'exception', 'timed out', 'timeout', 'cannot connect', 'not found'],
    priority: 'HIGH',
    suggestedAction: 'Review the error and take action.',
  },
  {
    id: 'rule-running',
    label: 'Task in Progress',
    status: 'RUNNING',
    keywords: ['loading', 'processing', 'running', 'building', 'compiling', 'generating', 'uploading', 'downloading', 'installing', 'syncing', 'rendering', 'exporting'],
    priority: 'MEDIUM',
    suggestedAction: 'Task is running. Check back when complete.',
  },
  {
    id: 'rule-completed',
    label: 'Task Completed',
    status: 'COMPLETED',
    keywords: ['completed', 'done', 'finished', 'success', 'complete', 'deployed', 'build succeeded', 'all tests passed'],
    priority: 'LOW',
    suggestedAction: 'Task is done. Review the result.',
  },
]

const EMPTY: StorageSchema = {
  watchedWindows: [],
  taskCards: [],
  notificationHistory: [],
  settings: {
    notificationsEnabled: true,
    notifyOnWaiting: true,
    notifyOnFailed: true,
    notifyOnCompleted: false,
    notificationCooldownMinutes: 5,
    privateModeEnabled: false,
    monitoringPaused: false,
    useAiClassifier: false,
    captureIntervalSeconds: 10,
  },
  detectionRules: [],
}

function storagePath(): string {
  return join(app.getPath('userData'), 'deskkeeper-storage.json')
}

function read(): StorageSchema {
  const p = storagePath()
  if (!existsSync(p)) return { ...EMPTY, settings: { ...EMPTY.settings } }
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as StorageSchema
  } catch {
    return { ...EMPTY, settings: { ...EMPTY.settings } }
  }
}

function write(data: StorageSchema): void {
  const p = storagePath()
  const dir = dirname(p)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

export function getWatchedWindows(): WatchedWindow[] {
  return read().watchedWindows
}

export function saveWatchedWindow(win: WatchedWindow): void {
  const data = read()
  const idx = data.watchedWindows.findIndex(w => w.id === win.id)
  if (idx >= 0) data.watchedWindows[idx] = win
  else data.watchedWindows.push(win)
  write(data)
}

export function removeWatchedWindow(id: string): void {
  const data = read()
  data.watchedWindows = data.watchedWindows.filter(w => w.id !== id)
  data.taskCards = data.taskCards.filter(c => c.windowId !== id)
  write(data)
}

export function getTaskCards(): TaskCard[] {
  return read().taskCards
}

export function saveTaskCard(card: TaskCard): void {
  const data = read()
  const idx = data.taskCards.findIndex(c => c.id === card.id)
  if (idx >= 0) data.taskCards[idx] = card
  else data.taskCards.push(card)
  write(data)
}

export function removeTaskCard(id: string): void {
  const data = read()
  data.taskCards = data.taskCards.filter(c => c.id !== id)
  write(data)
}

export function getSettings(): UserSettings {
  return read().settings
}

export function saveSettings(settings: Partial<UserSettings>): void {
  const data = read()
  data.settings = { ...data.settings, ...settings }
  write(data)
}

export function getDetectionRules(): DetectionRule[] {
  return read().detectionRules
}

export function saveDetectionRule(rule: DetectionRule): void {
  const data = read()
  const idx = data.detectionRules.findIndex(r => r.id === rule.id)
  if (idx >= 0) data.detectionRules[idx] = rule
  else data.detectionRules.push(rule)
  write(data)
}

export function removeDetectionRule(id: string): void {
  const data = read()
  data.detectionRules = data.detectionRules.filter(r => r.id !== id)
  write(data)
}

export function seedDefaultRules(): void {
  const data = read()
  if (data.detectionRules.length === 0) {
    data.detectionRules = DEFAULT_RULES
    write(data)
  }
}
