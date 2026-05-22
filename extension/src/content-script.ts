// Runs at document_idle. Detects browser-specific task states and sends
// an enriched signal to the background service worker.

interface ContentMessage {
  url: string
  title: string
  visibleText: string
  detectedState?: string
}

function detectState(): string | undefined {
  // Upload in progress
  if (document.querySelector('progress, [role="progressbar"]')) return 'upload-in-progress'

  // Visible error / alert
  const errorEl = document.querySelector<HTMLElement>('[class*="error"], [class*="failed"], [role="alert"]')
  if (errorEl?.innerText?.trim()) return 'error-visible'

  // Form with unfilled required fields
  const form = document.querySelector('form')
  if (form) {
    const hasEmpty = Array.from(form.querySelectorAll<HTMLInputElement>('[required]')).some(
      el => !el.value.trim(),
    )
    if (hasEmpty) return 'form-incomplete'
  }

  return undefined
}

const detectedState = detectState()
const visibleText = (document.body?.innerText ?? '').slice(0, 500)

// Only send if there's something meaningful to report
if (detectedState || visibleText.length > 0) {
  const message: ContentMessage = {
    url: location.href,
    title: document.title,
    visibleText,
    detectedState,
  }
  chrome.runtime.sendMessage(message)
}
