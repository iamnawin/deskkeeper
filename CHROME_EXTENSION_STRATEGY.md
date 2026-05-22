# Chrome Extension Strategy

## Position: Companion Only

The Chrome extension is **not** the primary product. It is a companion to the Electron desktop app.

The desktop app is the central control tower. The extension provides richer, browser-specific context that the desktop app cannot easily detect from window titles alone.

Do not build the extension first. Do not position DeskKeeper as a browser extension.

---

## Why the Extension Is a Companion

| Capability | Desktop App | Chrome Extension |
|---|---|---|
| Monitor terminal apps | Yes | No |
| Monitor VS Code, Figma, etc. | Yes | No |
| Access browser tab URL | No (title only) | Yes |
| Read DOM-level form state | No | Yes |
| Detect upload progress in browser | Limited | Yes |
| Cross-app unified view | Yes | No |
| Local-first detection | Yes | Partial |

The extension fills the DOM-level browser gap. The desktop app handles everything else.

---

## What the Extension Will Do

1. Detect active tab URL and title
2. Optionally read visible page text (after user grants permission)
3. Detect common browser-specific states:
   - Form with required fields not submitted
   - Email/document draft open
   - Upload in progress or complete
   - Publish action pending
   - Download ready
   - Error visible on page
4. Send detected signals to the Electron desktop app via a local bridge (HTTP or native messaging)
5. If desktop app is not running, log signals locally

---

## Privacy Rules for Extension

- Do not scrape form field values
- Do not collect passwords or payment info
- Do not upload page content to cloud
- Require explicit user permission before reading page text
- All communication stays between extension and local desktop app

---

## Technical Approach

- Manifest V3
- `background.ts`: service worker to manage tab events
- `content-script.ts`: optional DOM inspection (permission-gated)
- `popup.html/tsx`: simple status display

---

## Bridge to Desktop App

The extension communicates with the Electron app via:
- Option A: Local HTTP server on the Electron app (localhost:PORT)
- Option B: Chrome Native Messaging (more complex, more secure)

MVP: Local HTTP bridge on a fixed localhost port.

---

## Build Order

Extension is built in Phase 7, after:
1. Desktop app is complete and stable
2. Detection engine is working
3. Local storage is in place
4. Core notification system works

The extension enhances the system. It never replaces it.
