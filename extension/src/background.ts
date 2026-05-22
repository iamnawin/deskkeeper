const BRIDGE_URL = 'http://localhost:7420'

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

async function sendSignal(signal: TabSignal): Promise<void> {
  try {
    await fetch(`${BRIDGE_URL}/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signal),
    })
  } catch {
    // Desktop app not running — drop silently
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
