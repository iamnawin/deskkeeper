const HOST_NAME = 'com.zeroorigins.deskkeeper'

interface PongMessage {
  type: 'pong'
  electron: boolean
}

// Ping the native host (one-shot). It replies with whether the desktop app's
// pipe accepted a connection, so we can tell "app running" from "host missing".
function checkConnection(): Promise<boolean> {
  return new Promise(resolve => {
    try {
      chrome.runtime.sendNativeMessage(HOST_NAME, { type: 'ping' }, (response?: PongMessage) => {
        if (chrome.runtime.lastError || !response) return resolve(false)
        resolve(response.electron === true)
      })
    } catch {
      resolve(false)
    }
  })
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
