# DeskKeeper — Chrome Extension Companion

Browser companion for DeskKeeper. Sends tab signals (upload progress, form state, errors) to the desktop app over **Chrome Native Messaging** — no HTTP server, no open port.

---

## Building

```bash
npm install
npm run build
```

Output lands in `extension/dist/`.

## Loading in Chrome

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the `extension/dist/` folder
5. Copy the **extension ID** Chrome shows for DeskKeeper.

The DeskKeeper icon appears in the toolbar. Click it to see connection status.

## Connecting to the desktop app (Native Messaging)

The bridge uses Chrome Native Messaging, so the desktop app must know this
extension's ID to accept its messages:

1. Set the ID before launching the app (PowerShell):
   `$env:DESKKEEPER_EXTENSION_ID = "<id-from-chrome>"` — or edit the default in
   `app/src/main/services/native-host-service.ts`.
2. Start the desktop app. On startup it registers the native host in the Windows
   registry and writes the host manifest to its userData folder.
3. Open the extension popup — the dot turns green once the host can reach the app.

> The host is launched by Chrome on demand and talks to the app over a local
> named pipe (`\\.\pipe\deskkeeper-bridge`). No port is opened.

## How it works

- **Content script** runs on every page at `document_idle`. Detects upload progress bars, visible errors, and incomplete required form fields. Sends a signal to the background service worker.
- **Background service worker** opens one native port (`chrome.runtime.connectNative`) and forwards signals to the desktop app's native host. If the app is not running, signals are dropped silently.
- **Popup** pings the native host; green dot when the desktop app answers, red when not.

## Popup status

| Dot color | Meaning |
|---|---|
| Green | Desktop app is running and reachable |
| Red | Desktop app is not running |
| Pulsing grey | Checking connection |

## Privacy

- No data leaves the machine — signals go app-to-app over a local named pipe, never the network
- Signals are dropped if `Private mode` is enabled in the desktop app
- Only `title` and a 500-character excerpt of visible body text are sent

## Files

```
extension/
├── manifest.json           Chrome MV3 manifest
├── vite.config.ts          Build config (multi-entry Vite)
├── src/
│   ├── background.ts       Service worker — tab events + bridge relay
│   ├── content-script.ts   DOM state detection
│   └── popup/
│       ├── popup.html      Extension popup UI
│       └── popup.ts        Popup logic (connection check + active tab URL)
└── dist/                   Built output — load this in Chrome
```
