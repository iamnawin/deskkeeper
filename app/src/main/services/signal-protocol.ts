// Protocol the native host uses to forward tab signals to the app: newline-
// delimited JSON over a named pipe. Pure (no Electron) so it is unit-testable.

export interface TabSignal {
  tabId: number
  url: string
  title: string
  visibleText?: string
  detectedState?: string
}

export function isTabSignal(value: unknown): value is TabSignal {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.tabId === 'number' && typeof v.title === 'string'
}

// Split a growing buffer into complete signals plus the trailing partial line.
// Malformed or non-signal lines are skipped, never thrown.
export function parseNdjson(buffer: string): { signals: TabSignal[]; rest: string } {
  const lines = buffer.split('\n')
  const rest = lines.pop() ?? ''
  const signals: TabSignal[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      const obj = JSON.parse(trimmed)
      if (isTabSignal(obj)) signals.push(obj)
    } catch {
      // ignore malformed line
    }
  }
  return { signals, rest }
}
