# Prompt: Build Chrome Extension Companion

Build the Chrome extension companion for DeskKeeper.

## Important

The Chrome extension is NOT the main product. The Electron desktop app is the central control tower. The extension only provides richer browser-specific context.

Build this only after the desktop app is complete and stable (Phase 7).

## Directory

Create under `/extension` in this repo.

## Requirements

1. Manifest V3
2. `background.ts` — service worker: detect active tab changes
3. `content-script.ts` — optional DOM inspection (behind permission gate)
4. `popup.html/tsx` — simple status display
5. Detect active tab:
   - URL
   - Title
   - Tab state
6. Detect common browser states (from tab title + optional DOM):
   - Form not submitted (required fields visible)
   - Draft open (compose window, unsaved document)
   - Upload complete (progress complete, submit pending)
   - Publish pending (content ready but publish not clicked)
   - Download ready
   - Error visible on page
7. Send detected signals to the desktop app via local HTTP bridge (localhost)
8. If desktop app is not running, log signals locally in extension storage

## Privacy Rules

- Do not scrape form field values
- Do not collect passwords or payment card data
- Do not upload page content to cloud
- Require explicit user permission before content-script reads page text
- All signals stay between extension and local desktop app only

## Bridge to Desktop App

Simple local HTTP server on the Electron app receives signals:
```
POST http://localhost:7842/signals
Body: { windowId, title, url, detectedState, timestamp }
```

Extension sends signal on tab state change.

## After Implementation

Explain:
1. Permissions requested and why
2. How bridge works
3. How to test locally
4. Security considerations
