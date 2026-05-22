import { BrowserWindow } from 'electron'
import { listOpenWindows } from './window-monitor-service'
import { getTaskCards, saveTaskCard, getSettings, getDetectionRules } from './storage-service'
import { runDetection } from './detection-engine'
import { maybeNotify } from './notification-service'
import { captureWindow } from './capture-service'
import type { TaskStatus } from '../../shared/types'

const SKIP_STATUSES: TaskStatus[] = ['DONE', 'IGNORED']

let timer: ReturnType<typeof setInterval> | null = null

function notifyRenderer(): void {
  BrowserWindow.getAllWindows()[0]?.webContents.send('taskCards:updated')
}

async function tick(): Promise<void> {
  const settings = getSettings()
  if (settings.monitoringPaused || settings.privateModeEnabled) return

  const cards = getTaskCards()
  if (cards.length === 0) return

  const rules = getDetectionRules()
  const openWindows = await listOpenWindows()
  const openById = new Map(openWindows.map(w => [w.id, w]))

  const now = new Date().toISOString()
  let changed = false

  for (const card of cards) {
    if (SKIP_STATUSES.includes(card.status)) continue
    if (card.snoozedUntil && new Date(card.snoozedUntil) > new Date()) continue

    const openWin = openById.get(card.windowId)
    let newStatus: TaskStatus

    if (!openWin) {
      newStatus = 'IDLE'
    } else {
      const { visibleText } = await captureWindow(card.windowId)
      const result = runDetection(
        { windowId: card.windowId, windowTitle: openWin.title, appName: card.appName, visibleText, now },
        rules,
      )
      newStatus = result.status
    }

    if (newStatus !== card.status) {
      const updatedCard = { ...card, status: newStatus, lastStateChangeAt: now, lastSeenAt: now }
      saveTaskCard(updatedCard)
      maybeNotify(updatedCard, settings)
      changed = true
    }
  }

  if (changed) notifyRenderer()
}

export function startPolling(intervalSeconds = 10): void {
  if (timer !== null) return
  timer = setInterval(() => { tick().catch(() => {}) }, intervalSeconds * 1000)
}

export function stopPolling(): void {
  if (timer === null) return
  clearInterval(timer)
  timer = null
}

export function isPolling(): boolean {
  return timer !== null
}
