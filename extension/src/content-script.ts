// Runs at document_idle. Reports LIVE tab state to the background worker:
// re-emits when the title changes or the SPA navigates (most modern sites swap
// content without a full reload), with general, site-agnostic state detection.

interface ContentMessage {
  url: string
  title: string
  visibleText: string
  detectedState?: string
}

// Any actively-playing <video>/<audio> — general across streaming/media sites,
// no per-site logic.
function isMediaPlaying(): boolean {
  return Array.from(document.querySelectorAll<HTMLMediaElement>('video, audio')).some(
    (m) => !m.paused && !m.ended && m.currentTime > 0 && m.readyState > 2,
  )
}

function detectState(): string | undefined {
  if (isMediaPlaying()) return 'media-playing'

  if (document.querySelector('progress, [role="progressbar"]')) return 'upload-in-progress'

  const errorEl = document.querySelector<HTMLElement>('[class*="error"], [class*="failed"], [role="alert"]')
  if (errorEl?.innerText?.trim()) return 'error-visible'

  const form = document.querySelector('form')
  if (form) {
    const hasEmpty = Array.from(form.querySelectorAll<HTMLInputElement>('[required]')).some(
      (el) => !el.value.trim(),
    )
    if (hasEmpty) return 'form-incomplete'
  }

  return undefined
}

// De-dupe: only send when something the app cares about actually changed.
let lastKey = ''
function report(): void {
  // Only the active (visible) tab reports. Background tabs stay silent so the
  // desktop app never sees — and never auto-watches — tabs the user isn't on.
  if (document.visibilityState !== 'visible') return

  const detectedState = detectState()
  const title = document.title
  const key = `${title}|${detectedState ?? ''}|${location.href}`
  if (key === lastKey) return
  lastKey = key

  const message: ContentMessage = {
    url: location.href,
    title,
    visibleText: (document.body?.innerText ?? '').slice(0, 500),
    detectedState,
  }
  chrome.runtime.sendMessage(message)
}

report()

// Title changes (covers SPA route changes that rewrite <title> with no reload).
const titleEl = document.querySelector('title')
if (titleEl) new MutationObserver(report).observe(titleEl, { childList: true })

// SPA navigation via the History API, plus back/forward.
for (const method of ['pushState', 'replaceState'] as const) {
  const original = history[method]
  history[method] = function (this: History, ...args: unknown[]) {
    const result = original.apply(this, args as Parameters<History[typeof method]>)
    report()
    return result
  } as History[typeof method]
}
window.addEventListener('popstate', report)

// Report when this tab becomes the active one (its content is now what's on screen).
document.addEventListener('visibilitychange', report)

// Media play/pause/ended — capture phase catches events from any media element.
for (const evt of ['play', 'pause', 'ended'] as const) {
  document.addEventListener(evt, report, true)
}

// Light periodic refresh for long-lived tabs; cheap because report() only sends
// when the de-dupe key actually changes.
setInterval(report, 15000)
