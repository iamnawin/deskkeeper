import { createServer, Server } from 'http'
import { BrowserWindow } from 'electron'
import { getSettings, saveTaskCard, getTaskCards } from './storage-service'
import { maybeNotify } from './notification-service'
import type { TaskCard, TaskStatus } from '../../shared/types'

export const BRIDGE_PORT = 7420

interface TabSignal {
  tabId: number
  url: string
  title: string
  visibleText?: string
  detectedState?: string
}

let server: Server | null = null
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

  if (result.status !== existing.status) {
    const updated: TaskCard = {
      ...existing,
      title: signal.title,
      status: result.status,
      detectedReason: result.detectedReason,
      suggestedAction: result.suggestedAction,
      lastSeenAt: now,
      lastStateChangeAt: now,
    }
    saveTaskCard(updated)
    maybeNotify(updated, settings)
    notifyRenderer()
  }
}

export function startExtensionBridge(): void {
  if (server !== null) return

  server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    if (req.method === 'GET' && req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ running: true }))
      return
    }

    if (req.method === 'POST' && req.url === '/signal') {
      let body = ''
      req.on('data', chunk => { body += String(chunk) })
      req.on('end', () => {
        try {
          handleSignal(JSON.parse(body) as TabSignal)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        } catch {
          res.writeHead(400)
          res.end()
        }
      })
      return
    }

    res.writeHead(404)
    res.end()
  })

  server.listen(BRIDGE_PORT)
}

export function stopExtensionBridge(): void {
  if (server === null) return
  server.close()
  server = null
}
