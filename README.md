# DeskKeeper AI

> Your desktop control tower. Know what is waiting, failed, completed, or forgotten.

---

## What is DeskKeeper?

DeskKeeper AI is a **local-first desktop control tower** for unfinished work across screens, apps, tabs, tools, uploads, drafts, forms, renders, terminals, meetings, deployments, and AI agents.

Modern users work across many windows and monitors simultaneously. One screen may have a coding agent waiting for approval. Another may have a video render completing. Another may have an email draft unsent. Another may have a Vercel deployment failing silently.

DeskKeeper watches your open work and tells you what needs attention before it gets forgotten.

---

## One-Line Pitch

**DeskKeeper watches your open work and tells you what needs attention.**

---

## Current Status

**v0.1.0** — All 9 build phases complete. MVP ready for local demo.

---

## Running the Desktop App (Dev Mode)

```bash
cd app
npm install
npm run dev
```

The Electron app opens in dev mode with hot-reload. No extra setup required.

---

## Building the Desktop App (Production)

```bash
cd app
npm install
npm run build        # compile only (fast check)
npm run package      # compile + create installer in app/dist/
```

The installer is built to:
- **Windows**: `app/dist/DeskKeeper-0.1.0-win-x64.exe`
- **Mac**: `app/dist/DeskKeeper-0.1.0-mac-x64.dmg` / `-arm64.dmg`
- **Linux**: `app/dist/DeskKeeper-0.1.0-linux-x64.AppImage`

---

## Building the Chrome Extension

```bash
cd extension
npm install
npm run build        # compiles to extension/dist/
```

### Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the folder: `extension/dist/`
5. The DeskKeeper extension icon appears in the Chrome toolbar

The extension connects to the desktop app on `localhost:7420`. The popup shows green when the desktop app is running.

---

## Demo Mode

If you don't have real windows to monitor, load demo data:

1. Launch the desktop app (`npm run dev` inside `app/`)
2. Navigate to **Settings → Demo → Load demo data**
3. Click **Load demo data**
4. Go to **Dashboard** — 4 representative task cards appear

---

## MVP Features (v0.1.0)

- View currently open windows
- Select windows to watch
- Watched windows become task cards
- Automatic state detection: `WAITING_FOR_USER`, `RUNNING`, `FAILED`, `COMPLETED`, `IDLE`
- Desktop notifications when attention is needed
- Detection rules engine (keyword-based, configurable)
- Settings persistence (local JSON, no cloud)
- Privacy controls: private mode, pause monitoring
- Chrome extension companion with popup status indicator
- Demo mode (Settings → Load demo data)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Desktop runtime | Electron |
| UI framework | React + TypeScript |
| Build tool | electron-vite |
| Styling | Tailwind CSS |
| Storage | Local JSON (app data directory) |
| Detection | Rule-based engine (AI optional) |
| Extension | MV3, Vite, TypeScript |

---

## Project Structure

```
DeskKeeper AI/
├── app/                    Electron desktop app
│   ├── src/main/           Main process (IPC, services)
│   ├── src/renderer/       React UI
│   ├── src/preload/        Electron preload bridge
│   └── src/shared/         Shared TypeScript types
├── extension/              Chrome extension companion
│   ├── src/                Extension source
│   └── dist/               Built extension (load this in Chrome)
└── *.md                    Product documentation
```

---

## Roadmap

| Phase | Goal | Status |
|---|---|---|
| 0 | Documentation | ✓ |
| 1 | Electron mock UI | ✓ |
| 2 | Window monitor + watched windows | ✓ |
| 3 | Rule-based detection engine | ✓ |
| 4 | Desktop notifications | ✓ |
| 5 | Local storage persistence | ✓ |
| 6 | OCR abstraction (placeholder) | ✓ |
| 7 | Chrome extension companion | ✓ |
| 8 | Optional AI classifier | ✓ |
| 9 | Packaging + distribution | ✓ |
| 10 | MVP hardening + demo readiness | ✓ |

---

## Documentation

All product decisions are captured in markdown files at the root of this repo. Start with `PROJECT_CONTEXT.md` for the full picture.

See `TROUBLESHOOTING.md` for common issues. See `RELEASE_NOTES.md` for v0.1.0 changes.
