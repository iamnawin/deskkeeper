import { BrowserWindow } from 'electron'
import { listOpenWindows } from './window-monitor-service'
import { getTaskCards, saveTaskCard, getSettings, getDetectionRules } from './storage-service'
import { runDetection } from './detection-engine'
import { maybeNotify } from './notification-service'
import { captureWindow } from './capture-service'
import { classify } from './ai-classifier'
import { recordActivity, isStale } from './stale-detection'
import { getSignalForWindow, browserStateToDetection } from './extension-bridge'
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
    let reason = card.detectedReason
    let suggested = card.suggestedAction
    let title = card.title
    let lastActivityAt = card.lastActivityAt ?? card.lastStateChangeAt

    if (!openWin) {
      newStatus = 'IDLE'
    } else {
      // Track title-change activity before detection so a frozen window accrues
      // staleness even while its status stays RUNNING.
      const activity = recordActivity(card, openWin.title, now)
      title = activity.title
      lastActivityAt = activity.lastActivityAt

      const { visibleText } = await captureWindow(card.windowId, openWin.title, { ocr: settings.ocrCaptureEnabled })
      const detectionInput = { windowId: card.windowId, windowTitle: openWin.title, appName: card.appName, visibleText, now }
      let result = runDetection(detectionInput, rules)

      // AI classifier runs only when explicitly enabled and rule confidence is low
      if (settings.useAiClassifier && result.confidence < 0.5) {
        const aiResult = await classify(detectionInput)
        if (aiResult !== null) result = aiResult
      }

      newStatus = result.status
      reason = result.detectedReason
      suggested = result.suggestedAction

      // A RUNNING window whose title has gone quiet past the threshold looks
      // hung — surface it for attention instead of leaving it silently running.
      if (isStale(newStatus, lastActivityAt, settings, now)) {
        newStatus = 'WAITING_FOR_USER'
        reason = `Appears stalled — no change for ${settings.staleThresholdMinutes} min`
        suggested = 'Check this window — the task may be stuck.'
      }

      // The Chrome extension is a richer capture source than the window title:
      // a fresh tab signal both proves the window is alive (so it can't be
      // stale) and carries DOM state — media playing, a visible error, an
      // incomplete form — the title alone can't reveal. Let it win when present.
      const browser = browserStateToDetection(getSignalForWindow(openWin.title)?.detectedState)
      if (browser) {
        newStatus = browser.status
        reason = browser.detectedReason
        suggested = browser.suggestedAction
      }
    }

    const statusChanged = newStatus !== card.status
    const titleChanged = title !== card.title

    if (statusChanged || titleChanged) {
      const updatedCard = {
        ...card,
        status: newStatus,
        title,
        lastActivityAt,
        lastSeenAt: openWin ? now : card.lastSeenAt,
        lastStateChangeAt: statusChanged ? now : card.lastStateChangeAt,
        ...(statusChanged ? { detectedReason: reason, suggestedAction: suggested } : {}),
      }
      saveTaskCard(updatedCard)
      if (statusChanged) maybeNotify(updatedCard, settings)
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
