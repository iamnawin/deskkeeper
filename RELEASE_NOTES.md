# DeskKeeper Release Notes

---

## v0.1.0 — MVP Release (2026-05-22)

First complete build of DeskKeeper AI. All 10 phases shipped.

### What's included

**Core app**
- Electron desktop app (Windows/Mac/Linux)
- Dark control tower UI: Dashboard, Watched Windows, Detection Rules, Settings
- Window monitor using Electron's `desktopCapturer` — lists all open windows
- Task card system: watch a window → auto-creates a task card
- Rule-based detection engine — keyword matching against window titles
  - Built-in rules: `WAITING_FOR_USER`, `FAILED`, `RUNNING`, `COMPLETED`
  - Configurable priority and suggested actions per rule
- Desktop notifications via Electron Notification API
  - Configurable per-status and with cooldown
- Local JSON storage in OS user data directory
- Settings persistence: notification prefs, monitoring toggles, capture interval
- Private mode: pauses all monitoring and signal processing
- Polling loop: checks watched windows every 10 seconds (configurable)

**Chrome extension**
- Manifest V3 extension with service worker, content script, and popup
- DOM state detection: upload progress, form completion, visible errors
- Signals relayed to desktop app over local HTTP bridge (`localhost:7420`)
- Popup shows connection status and active tab URL
- Silent failover when desktop app is not running

**AI classifier (opt-in stub)**
- Disabled by default
- Activates only when `ANTHROPIC_API_KEY` is set AND rule confidence < 50%
- TODO block in `ai-classifier.ts` ready for Anthropic API wiring

**Demo mode**
- Settings → Demo → Load demo data: seeds 4 representative task cards
- Shows all status types: WAITING_FOR_USER, FAILED, RUNNING, ACTIVE

**Packaging**
- Windows: NSIS installer (x64)
- Mac: DMG (x64 + arm64)
- Linux: AppImage (x64)

### Known Limitations

- Window title detection only — no OCR or accessibility API integration yet. Detection accuracy depends on title keyword matches.
- `desktopCapturer` requires screen capture permission on macOS and may return empty on some Windows privacy configurations.
- Content script detection is shallow DOM inspection; complex SPAs may not report state changes mid-session without page reload.
- AI classifier is a stub — requires manual implementation of the Anthropic API call in `app/src/main/services/ai-classifier.ts`.
- `captureWindow()` returns `visibleText: undefined` — OCR swap-point is in place but not implemented.
- Port 7420 is hardcoded for the extension bridge. Conflicts will silently prevent browser signals from reaching the app.
- No auto-update mechanism in v0.1.0.

### Next priorities (post-MVP)

- Accessibility API or OCR for real visible-text detection
- Snooze and mark-done actions from task cards
- Per-window rule customization
- Task history view
- Persistent notification log
- Onboarding flow for first-time users
