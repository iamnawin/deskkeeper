const BRIDGE_URL = 'http://localhost:7420'

async function checkConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${BRIDGE_URL}/status`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

async function init(): Promise<void> {
  const dot = document.getElementById('dot')!
  const label = document.getElementById('status-label')!
  const urlEl = document.getElementById('tab-url')!

  const connected = await checkConnection()
  dot.className = `dot ${connected ? 'connected' : 'disconnected'}`
  label.textContent = connected ? 'DeskKeeper connected' : 'Desktop app not running'

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  urlEl.textContent = tab?.url ?? '—'
}

init()
