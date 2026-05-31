import net from 'net'
import { existsSync, unlinkSync } from 'fs'
import { getSettings, getTaskCards, removeTaskCard } from './storage-service'
import { parseNdjson, type TabSignal } from './signal-protocol'
import type { TaskStatus } from '../../shared/types'

// Local named pipe the native messaging host forwards tab signals to. Not a TCP
// port: no firewall surface, no port-conflict, no listening network socket.
export const PIPE_PATH =
  process.platform === 'win32' ? '\\\\.\\pipe\\deskkeeper-bridge' : '/tmp/deskkeeper-bridge.sock'

let server: net.Server | null = null

// Latest active-tab signal per normalized title. The extension is a richer
// capture source for watched browser windows — it deliberately does NOT create
// its own task cards, which would auto-watch tabs the user never chose (and
// flooded the dashboard). Polling reads these to enrich the matching
// watched-window card; that keeps a single writer for cards.
const latestSignals = new Map<string, { signal: TabSignal; at: number }>()
const SIGNAL_TTL_MS = 60_000

// Strip the trailing " - Google Chrome" (or Edge/Brave/Chromium) that the OS
// appends to a browser window title, so a tab's document.title matches the
// watched window's OS title.
function normalizeTitle(title: string): string {
  return title
    .replace(/\s+[-–—]\s+(Google Chrome|Chromium|Microsoft Edge|Brave)\s*$/i, '')
    .trim()
    .toLowerCase()
}

function handleSignal(signal: TabSignal): void {
  const settings = getSettings()
  if (settings.monitoringPaused || settings.privateModeEnabled) return
  latestSignals.set(normalizeTitle(signal.title), { signal, at: Date.now() })
}

// Freshest browser signal whose tab title matches an OS window title, or
// undefined when no live tab matches (or the last signal has gone stale).
export function getSignalForWindow(osWindowTitle: string): TabSignal | undefined {
  const key = normalizeTitle(osWindowTitle)
  const entry = latestSignals.get(key)
  if (!entry) return undefined
  if (Date.now() - entry.at > SIGNAL_TTL_MS) {
    latestSignals.delete(key)
    return undefined
  }
  return entry.signal
}

interface BrowserDetection {
  status: TaskStatus
  detectedReason: string
  suggestedAction: string
}

// Map a content-script DOM signal to a task state. Returns null for the generic
// "just an active tab" case so polling keeps its own rule-based result rather
// than being overridden with a meaningless ACTIVE.
export function browserStateToDetection(detectedState: string | undefined): BrowserDetection | null {
  switch (detectedState) {
    case 'error-visible':
      return { status: 'FAILED', detectedReason: 'Error visible on page', suggestedAction: 'Review the error on this tab.' }
    case 'form-incomplete':
      return { status: 'WAITING_FOR_USER', detectedReason: 'Form needs input', suggestedAction: 'This tab has an incomplete form.' }
    case 'upload-in-progress':
      return { status: 'RUNNING', detectedReason: 'Upload in progress', suggestedAction: 'Upload running — check back when complete.' }
    case 'media-playing':
      return { status: 'ACTIVE', detectedReason: 'Media playing', suggestedAction: '' }
    default:
      return null
  }
}

// One-time migration: older builds created a card per browser tab
// (id `tc-ext-tab-*`). The extension no longer owns cards — purge the strays.
function purgeLegacyTabCards(): void {
  for (const card of getTaskCards()) {
    if (card.id.startsWith('tc-ext-tab-')) removeTaskCard(card.id)
  }
}

export function startExtensionBridge(): void {
  if (server !== null) return

  purgeLegacyTabCards()

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
