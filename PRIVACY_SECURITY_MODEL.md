# Privacy and Security Model

## Privacy Principles

DeskKeeper is built privacy-first. The user must always be in control of what is monitored.

1. **User selects what to watch.** No default monitoring. Nothing is watched until the user explicitly chooses it.
2. **No full desktop recording.** Only window metadata (title, app name) in MVP. Screenshots are an opt-in feature.
3. **No cloud upload by default.** All processing happens locally. Screenshots, window text, and task state never leave the device without explicit user consent.
4. **No sensitive data collection.** Passwords, credit card numbers, form field values, and other sensitive inputs must never be captured.
5. **Private mode.** One-click mode that immediately pauses all monitoring, clears active task states, and suppresses all notifications.
6. **Pause monitoring.** Temporary global pause without clearing state.
7. **App blocklist.** User can permanently exclude specific apps or window titles from monitoring.
8. **Visible indicator.** The app must always show a clear indicator when monitoring is active (tray icon state, dashboard status badge).

---

## Security Architecture

### Electron Security

- `contextIsolation: true` — renderer process cannot access Node.js directly
- `nodeIntegration: false` — no raw Node access in renderer
- `sandbox: true` (where compatible) — renderer is sandboxed
- Preload script exposes only a minimal, typed API
- No `eval()` or `new Function()` in renderer

### IPC Security

- All IPC channels are explicitly whitelisted
- IPC inputs are validated before passing to services
- Renderer cannot call arbitrary main process functions

### Storage Security

- `electron-store` stores data in the user's AppData folder
- Sensitive settings (if any) can be encrypted with a user-provided key
- No credentials or tokens stored in plaintext

### Network Security

- No outbound network calls in MVP baseline
- AI classifier (if enabled) must use HTTPS only
- No telemetry without explicit user opt-in
- No auto-update mechanism that bypasses user confirmation

---

## User-Facing Privacy Copy

> DeskKeeper only watches windows you choose.  
> Processing is local by default.  
> You can pause monitoring anytime.  
> Your data never leaves your device unless you enable AI features.

---

## Monitoring Disclosure

DeskKeeper must never hide the fact that it is monitoring. Indicators:
- Tray icon changes state when monitoring is active
- Dashboard header shows "Monitoring Active / Paused" status
- Settings screen clearly shows what is being monitored
- First-launch onboarding explains monitoring behavior before it starts
