import { createServer, Server } from 'http'
import { BrowserWindow } from 'electron'
import { getSettings, saveTaskCard, getTaskCards, getDetectionRules } from './storage-service'
import { runDetection } from './detection-engine'
import { maybeNotify } from './notification-service'
import type { TaskCard } from '../../shared/types'

export const BRIDGE_PORT = 7420

interface TabSignal {
  tabId: number
  url: string
  title: string
  visibleText?: string
  detectedState?: string
}

let server: Server | null = null

function notifyRenderer(): void {
  BrowserWindow.getAllWindows()[0]?.webContents.send('taskCards:updated')
}

function handleSignal(signal: TabSignal): void {
  const settings = getSettings()
  if (settings.monitoringPaused || settings.privateModeEnabled) return

  const windowId = `ext-tab-${signal.tabId}`
  const now = new Date().toISOString()
  const rules = getDetectionRules()

  const result = runDetection(
    { windowId, windowTitle: signal.title, appName: 'Chrome', visibleText: signal.visibleText, now },
    rules,
  )

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
