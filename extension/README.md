# DeskKeeper — Chrome Extension Companion

Browser companion for DeskKeeper. Sends tab signals (upload progress, form state, errors) to the desktop app over a local HTTP bridge.

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

The DeskKeeper icon appears in the toolbar. Click it to see connection status.

## How it works

- **Content script** runs on every page at `document_idle`. Detects upload progress bars, visible errors, and incomplete required form fields. Sends a signal to the background service worker.
- **Background service worker** forwards signals to the desktop app at `http://localhost:7420/signal`. If the app is not running, signals are dropped silently.
- **Popup** shows a green dot when the desktop app is running, red when not.

## Popup status

| Dot color | Meaning |
|---|---|
| Green | Desktop app is running and reachable |
| Red | Desktop app is not running |
| Pulsing grey | Checking connection |

## Privacy

- No data leaves `localhost`
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
