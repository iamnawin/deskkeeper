# DeskKeeper — Chrome Extension Companion

This directory will contain the Chrome extension companion for DeskKeeper.

## Status

Not yet built. See `ROADMAP.md` Phase 7.

**Important**: The extension is built after the Electron desktop app is complete. It is a companion, not the core product.

## Purpose

Provides richer browser-specific signals to the DeskKeeper desktop app:
- Form submission state
- Upload progress and completion
- Draft documents
- Tab-level state detection

## Planned Files

```
extension/
├── manifest.json
├── background.ts
├── content-script.ts
├── popup.html
├── popup.tsx
└── README.md
```

## Build Order

Phase 7 — after:
- Desktop app complete
- Detection engine working
- Notifications working
- Local storage stable

## Next Step

Use `prompts/08_BUILD_CHROME_EXTENSION_PROMPT.md` when ready for Phase 7.
