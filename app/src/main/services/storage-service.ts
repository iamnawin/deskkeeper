import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import type { StorageSchema, WatchedWindow, TaskCard } from '../../shared/types'

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
