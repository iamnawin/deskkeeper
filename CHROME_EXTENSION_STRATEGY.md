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
4. Send detected signals to the Electron desktop app via Chrome Native Messaging
5. If desktop app is not running, drop signals silently

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

The extension communicates with the Electron app via **Chrome Native Messaging**.

The earlier MVP used a localhost HTTP server (port 7420). That was replaced because
a fixed TCP port breaks outside a dev machine: it can be blocked by a firewall,
owned by another process, or simply unreachable when the browser opens before the
app. Native Messaging has none of those failure modes — there is no listening
network port at all.

**How it works:**

1. The extension opens one long-lived port with `chrome.runtime.connectNative('com.zeroorigins.deskkeeper')` and posts tab signals to it.
2. Chrome launches the registered native host (a small Node script run by the app
   binary in `ELECTRON_RUN_AS_NODE` mode) and pipes messages to it over stdio.
3. The host forwards each signal to the running desktop app through a local
   **named pipe** (`\\.\pipe\deskkeeper-bridge`) — local-only, no firewall surface,
   no port conflict.
4. The desktop app registers the host on startup: it writes the host manifest +
   launcher into its userData folder and points
   `HKCU\Software\Google\Chrome\NativeMessagingHosts\com.zeroorigins.deskkeeper`
   at it (Windows). macOS/Linux registration is a later phase.

**Host identity:** the host manifest's `allowed_origins` must list the loaded
extension's ID. Set `DESKKEEPER_EXTENSION_ID` (or edit `native-host-service.ts`)
to the ID shown in `chrome://extensions` after loading `extension/dist`.

**App down:** if the desktop app isn't running, the pipe connect fails and the
host drops the signal silently — same behavior as the old HTTP bridge.

---

## Build Order

Extension is built in Phase 7, after:
1. Desktop app is complete and stable
2. Detection engine is working
3. Local storage is in place
4. Core notification system works

The extension enhances the system. It never replaces it.
