# Chrome Extension Companion Spec

## Role

The Chrome extension is a companion to the Electron desktop app. It enriches DeskKeeper with browser-specific context that the desktop app cannot detect from window titles alone.

See `CHROME_EXTENSION_STRATEGY.md` for full strategy.

## Extension Files

```
extension/
├── manifest.json
├── background.ts           Service worker
├── content-script.ts       DOM inspection (permission-gated)
├── popup.html              Extension popup UI
├── popup.tsx               Popup React component
└── README.md
```

## Manifest V3

```json
{
  "manifest_version": 3,
  "name": "DeskKeeper",
  "version": "0.1.0",
  "permissions": ["tabs", "storage", "notifications"],
  "optional_permissions": ["activeTab"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content-script.js"],
    "run_at": "document_idle"
  }]
}
```

## Signal Schema

```typescript
interface ExtensionSignal {
  tabId: number;
  url: string;
  title: string;
  detectedState: TaskStatus;
  detectedReason: string;
  timestamp: string;
}
```

## Bridge Protocol

```
POST http://localhost:7842/extension-signal
Content-Type: application/json
Body: ExtensionSignal
```

Desktop app validates signal origin (localhost only) and merges with task card for the matching watched window.

## Detection Rules for Extension

| Pattern | Detected State |
|---|---|
| Form with visible required fields | WAITING_FOR_USER |
| Upload progress bar visible | RUNNING |
| Upload complete, submit button visible | WAITING_FOR_USER |
| "Draft saved" text visible | WAITING_FOR_USER |
| Error message visible | FAILED |
| "Success" or confirmation visible | COMPLETED |
| Tab idle > threshold | IDLE |

## Privacy

- No form field values scraped
- No password fields read
- No page content sent to cloud
- Content script only runs when user has explicitly enabled it
