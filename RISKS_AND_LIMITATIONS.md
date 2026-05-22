# Risks and Limitations

## Privacy Concerns

**Risk**: Users or reviewers may perceive any screen monitoring as spyware.  
**Mitigation**: User-selected watchlist only. Visible monitoring indicator always shown. Private mode available. No screenshots stored or transmitted by default.

**Risk**: Accidental capture of sensitive windows (passwords, banking, private messages).  
**Mitigation**: App blocklist lets users exclude specific apps. Private mode available. OCR (Phase 2) must be explicitly enabled.

---

## OCR Accuracy

**Risk**: OCR may misread text, leading to false positives or false negatives in state detection.  
**Mitigation**: Rule engine works without OCR. OCR is an opt-in enhancement. Confidence scoring allows `UNKNOWN` fallback when accuracy is low.

---

## False Positives

**Risk**: Detection engine incorrectly classifies a window as FAILED or WAITING_FOR_USER, causing unnecessary notification spam.  
**Mitigation**: Conservative confidence thresholds. Cooldown prevents repeat notifications. User can ignore/mute a task. Rules are tunable.

---

## CPU and Memory Usage

**Risk**: Electron apps are memory-heavy. Regular window polling + optional OCR could spike CPU.  
**Mitigation**: Configurable polling interval (default: 10 seconds). OCR runs only on watched windows. Idle detection minimizes unnecessary processing. Pause monitoring option.

---

## Native OS Permissions

**Risk**: On Windows, some window listing APIs may require elevated permissions or accessibility permissions.  
**Mitigation**: Use `desktopCapturer` (no special permissions in most cases). Provide mock fallback if native listing fails. Document required permissions clearly.

---

## App Compatibility

**Risk**: Some apps may not expose their window title meaningfully (e.g., electron apps with generic titles, terminal emulators that reset titles).  
**Mitigation**: User can manually set a custom label for a watched window. Detection falls back to `UNKNOWN` for unrecognizable titles. OCR and AI layers (Phase 2+) improve coverage.

---

## Security Risk of Automation (Future Phases)

**Risk**: Future "safe action layer" (Phase 7+) could be abused or exploited to perform unintended actions.  
**Mitigation**: Actions require explicit user confirmation for each execution. No background autonomous actions. Detailed audit log of all actions taken.

---

## Chrome Extension Limits

**Risk**: Manifest V3 background service workers have limited lifetimes and restricted capabilities.  
**Mitigation**: Extension only needs to detect tab state and forward signals — limited background processing needed. Long-running state is held in the desktop app, not the extension.

---

## Electron Security

**Risk**: Electron apps can be vulnerable to remote code execution if webContent security is misconfigured.  
**Mitigation**: `nodeIntegration: false`, `contextIsolation: true`, minimal IPC surface, no remote URLs loaded in main window, content security policy set.

---

## Idle / False Forgotten Detection

**Risk**: A user may have a window genuinely "parked" and not forgotten — e.g., a reference doc kept open. Repeated IDLE notifications for intentionally-open windows.  
**Mitigation**: "Ignore" action permanently suppresses a window. Snooze available for long pauses. Idle threshold configurable. Idle notifications disabled by default.
