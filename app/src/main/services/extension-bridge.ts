import net from 'net'
import { existsSync, unlinkSync } from 'fs'
import { BrowserWindow } from 'electron'
import { getSettings, saveTaskCard, getTaskCards } from './storage-service'
import { maybeNotify } from './notification-service'
import { parseNdjson, type TabSignal } from './signal-protocol'
import type { TaskCard, TaskStatus } from '../../shared/types'

// Local named pipe the native messaging host forwards tab signals to. Not a TCP
// port: no firewall surface, no port-conflict, no listening network socket.
export const PIPE_PATH =
  process.platform === 'win32' ? '\\\\.\\pipe\\deskkeeper-bridge' : '/tmp/deskkeeper-bridge.sock'

let server: net.Server | null = null
let notifyTimer: ReturnType<typeof setTimeout> | null = null

// Coalesce rapid signal bursts (e.g. fast tab switching) into a single renderer
// refresh so the UI doesn't re-render the whole task list on every signal.
function notifyRenderer(): void {
  if (notifyTimer !== null) return
  notifyTimer = setTimeout(() => {
    notifyTimer = null
    BrowserWindow.getAllWindows()[0]?.webContents.send('taskCards:updated')
  }, 250)
}

interface Detected {
  status: TaskStatus
  detectedReason: string
  suggestedAction: string
}

// Map the content-script's structured page signal to a task state. We trust the
// DOM-based detectedState (real error element, progress bar, incomplete form)
// rather than keyword-matching arbitrary page text — the words "error"/"failed"
// appear on countless normal pages and produced constant false FAILED alerts.
function detectFromSignal(signal: TabSignal): Detected {
  switch (signal.detectedState) {
    case 'error-visible':
      return { status: 'FAILED', detectedReason: 'Error visible on page', suggestedAction: 'Review the error on this tab.' }
    case 'form-incomplete':
      return { status: 'WAITING_FOR_USER', detectedReason: 'Form needs input', suggestedAction: 'This tab has an incomplete form.' }
    case 'upload-in-progress':
      return { status: 'RUNNING', detectedReason: 'Upload in progress', suggestedAction: 'Upload running — check back when complete.' }
    case 'media-playing':
      return { status: 'ACTIVE', detectedReason: 'Media playing', suggestedAction: '' }
    default:
      return { status: 'ACTIVE', detectedReason: 'Active tab', suggestedAction: '' }
  }
}

function handleSignal(signal: TabSignal): void {
  const settings = getSettings()
  if (settings.monitoringPaused || settings.privateModeEnabled) return

  const windowId = `ext-tab-${signal.tabId}`
  const now = new Date().toISOString()
  const result = detectFromSignal(signal)

  const existing = getTaskCards().find(c => c.windowId === windowId)

  if (!existing) {
    const card: TaskCard = {
      id: `tc-${windowId}`,
      windowId,
      title: signal.title,
      appName: 'Chrome',
      status: result.status,
      priority: 'MEDIUM',
      detectedReason: result.detectedReason,
      suggestedAction: result.suggestedAction,
      lastSeenAt: now,
      lastStateChangeAt: now,
    }
    saveTaskCard(card)
    maybeNotify(card, settings)
    notifyRenderer()
    return
  }

  const statusChanged = result.status !== existing.status
  const titleChanged = signal.title !== existing.title
  // Nothing the user would see changed — skip the write to avoid churn.
  if (!statusChanged && !titleChanged) return

  const updated: TaskCard = {
    ...existing,
    title: signal.title,
    status: result.status,
    detectedReason: result.detectedReason,
    suggestedAction: result.suggestedAction,
    lastSeenAt: now,
    // Only a genuine state transition resets the state-change clock (and notifies).
    lastStateChangeAt: statusChanged ? now : existing.lastStateChangeAt,
  }
  saveTaskCard(updated)
  if (statusChanged) maybeNotify(updated, settings)
  notifyRenderer()
}

export function startExtensionBridge(): void {
  if (server !== null) return

  // A stale unix-socket file blocks listen() after an unclean exit (no-op on Windows pipes).
  if (process.platform !== 'win32' && existsSync(PIPE_PATH)) {
    try {
      unlinkSync(PIPE_PATH)
    } catch {
      // best effort
    }
  }

  server = net.createServer(socket => {
    let buffer = ''
    socket.on('data', chunk => {
      buffer += chunk.toString('utf8')
      const { signals, rest } = parseNdjson(buffer)
      buffer = rest
      for (const signal of signals) handleSignal(signal)
    })
    socket.on('error', () => {
      // client (native host) disconnected — nothing to do
    })
  })

  server.on('error', () => {
    // pipe unavailable; bridge stays down rather than crashing the app
  })
  server.listen(PIPE_PATH)
}

export function stopExtensionBridge(): void {
  if (server === null) return
  server.close()
  server = null
}
