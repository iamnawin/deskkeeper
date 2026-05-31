const HOST_NAME = 'com.zeroorigins.deskkeeper'

interface TabSignal {
  tabId: number
  url: string
  title: string
  visibleText?: string
  detectedState?: string
}

interface ContentMessage {
  url: string
  title: string
  visibleText: string
  detectedState?: string
}

// One long-lived native port for the whole browser session. Chrome launches the
// DeskKeeper native host on connect; the host forwards to the desktop app over a
// local pipe. No HTTP, no port, no firewall surface.
let port: chrome.runtime.Port | null = null

function getPort(): chrome.runtime.Port {
  if (port) return port
  port = chrome.runtime.connectNative(HOST_NAME)
  port.onDisconnect.addListener(() => {
    port = null // host exited or app absent; reconnect lazily on next signal
  })
  return port
}

function sendSignal(signal: TabSignal): void {
  try {
    getPort().postMessage(signal)
  } catch {
    port = null // connect/post failed (host not installed) — drop silently
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return
  sendSignal({ tabId, url: tab.url, title: tab.title ?? '' })
})

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId)
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return
    sendSignal({ tabId, url: tab.url, title: tab.title ?? '' })
  } catch {
    // Tab may have closed before we could read it
  }
})

// Receive enriched signals from content script; attach real tabId from sender
chrome.runtime.onMessage.addListener((message: ContentMessage, sender) => {
  const tabId = sender.tab?.id ?? -1
  if (tabId === -1) return
  sendSignal({ tabId, ...message })
})
