# Browser Extension Limitations

## Why the Desktop App Comes First

The extension is a companion. Understanding its limits is why the desktop app is the core product.

---

## Manifest V3 Constraints

1. **Background service workers** have limited lifetimes — they may be killed by the browser and cannot run persistent processes.
2. **No persistent background page** — signals must be sent promptly; long-polling is unreliable.
3. **webRequest blocking** is removed for most extensions (only available to enterprise/policy extensions).
4. **No native file system access** — cannot access files outside browser.
5. **No access to non-browser apps** — cannot see terminals, VS Code, native desktop apps.

---

## What Extensions Can and Cannot See

| Capability | Extension | Notes |
|---|---|---|
| Active tab URL | Yes | Standard |
| Tab title | Yes | Standard |
| Tab DOM content | Yes (with permission) | Requires `activeTab` or `<all_urls>` permission |
| Form field values | Yes (with permission) | Sensitive — must not collect passwords |
| Upload progress | Limited | Depends on DOM structure |
| Non-browser apps | No | Hard OS boundary |
| Terminal windows | No | Hard OS boundary |
| Native app state | No | Hard OS boundary |

---

## Privacy and Permission Concerns

- Chrome extension permissions are visible to users and reviewers
- Requesting `<all_urls>` or reading page content requires strong justification
- Chrome Web Store review will scrutinize data collection
- Users are increasingly wary of extensions with broad permissions

---

## Extension → Desktop Bridge Options

### Option A: Local HTTP Server (Chosen for MVP)
- Electron app runs a local HTTP server on a fixed port (e.g., 7842)
- Extension sends POST requests to `localhost:7842/signals`
- Simple, no native messaging setup
- Security: only localhost, validate origin

### Option B: Chrome Native Messaging
- More secure (no open port)
- Requires a registered native messaging host on the OS
- More complex setup for users

### Option C: WebSocket
- Bidirectional communication
- More complex than HTTP for MVP

---

## Build Order Rationale

Extension is built in Phase 7 because:
1. Its value is additive — desktop app provides core value without it
2. Extension complexity grows quickly when trying to handle all edge cases
3. Permission scope and Chrome Web Store review take time
4. Desktop app is a safer, more controllable first product
