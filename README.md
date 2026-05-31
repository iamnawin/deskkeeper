<div align="center">

# 🛰️ DeskKeeper AI

### Your desktop control tower for unfinished work.

*Know what's **waiting**, **failed**, **completed**, or **forgotten** — across every screen, app, and tab.*

<br/>

![Status](https://img.shields.io/badge/status-v0.1.0_MVP-22c55e?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Windows_·_macOS_·_Linux-0ea5e9?style=flat-square)
![Runtime](https://img.shields.io/badge/Electron-2c2e3b?style=flat-square&logo=electron)
![UI](https://img.shields.io/badge/React_+_TypeScript-3178c6?style=flat-square&logo=react)
![Tests](https://img.shields.io/badge/tests-33_passing-22c55e?style=flat-square)
![Privacy](https://img.shields.io/badge/privacy-local--first-8b5cf6?style=flat-square)

</div>

---

## The problem

You work across many windows and monitors at once. One screen has a coding agent **waiting for approval**. Another has a video render **completing**. An email draft sits **unsent**. A deployment is **failing silently** in a background tab.

Things slip. Attention is the bottleneck — not the work.

**DeskKeeper watches your open work and tells you what needs attention before it gets forgotten.**

It does three things, and nothing more: **observe → classify → notify.** No auto-clicking. No desktop takeover. No cloud uploads. Local-first by design.

---

## Highlights

| | |
|---|---|
| 🪟 **Watch what you choose** | You pick the windows to monitor — nothing is watched by default. |
| 🧭 **State detection** | Rule-based engine classifies windows: `WAITING_FOR_USER`, `RUNNING`, `FAILED`, `COMPLETED`, `IDLE`. |
| 🎯 **App-aware heuristics** | Knows VS Code's `●` unsaved dot, Chrome/Slack `(N)` unread badges, "Not Responding" pages, live Zoom meetings. |
| ⏱️ **Stale / hang detection** | A window that goes quiet past your threshold is surfaced instead of silently "running" forever. |
| 🔔 **Smart notifications** | Desktop alerts on attention-worthy changes, with cooldown to kill spam. |
| 🧩 **Browser companion** | Optional Chrome extension adds DOM-level signals (form state, upload progress, page errors) over **Chrome Native Messaging** — no open port. |
| 🔒 **Privacy controls** | Private mode pauses everything. No screenshots stored or transmitted. AI is opt-in and off by default. |

---

## Quick start (dev)

> Requires [Node.js 18+](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
cd app
pnpm install
pnpm dev          # Electron opens with hot-reload — no extra setup
```

No real windows to monitor? Load sample data: **Settings → Demo → Load demo data**, then open **Dashboard**.

---

## Build & package

```bash
cd app
pnpm install
pnpm build        # compile only (fast sanity check)
pnpm package      # compile + create an installer in app/dist/
```

| OS | Artifact |
|---|---|
| 🪟 Windows | `app/dist/DeskKeeper-0.1.0-win-x64.exe` (NSIS) |
| 🍎 macOS | `app/dist/DeskKeeper-0.1.0-mac-x64.dmg` / `-arm64.dmg` |
| 🐧 Linux | `app/dist/DeskKeeper-0.1.0-linux-x64.AppImage` |

---

## Browser companion (optional)

The Chrome extension adds signals the desktop app can't read from a window title — incomplete forms, upload progress, visible page errors. It talks to the app over **Chrome Native Messaging** (a local named pipe), so there is **no HTTP server and no open port** to be blocked or hijacked.

```bash
cd extension
pnpm install
pnpm build        # outputs to extension/dist/
```

**Load it in Chrome:**

1. Open `chrome://extensions` → enable **Developer mode**.
2. **Load unpacked** → select `extension/dist/`.
3. Copy the **extension ID** Chrome shows for DeskKeeper.

**Connect it to the app:**

1. Tell the app which extension to trust:
   ```powershell
   $env:DESKKEEPER_EXTENSION_ID = "<id-from-chrome>"
   ```
   (or edit the default in `app/src/main/services/native-host-service.ts`).
2. Launch the desktop app — on startup it registers the native messaging host.
3. Click the extension's toolbar icon: a green dot means the app answered.

> If the app isn't running, the extension drops signals silently. The companion is **optional** — desktop window detection works without it.

---

## How it works

```
┌──────────────────┐        ┌─────────────────────────────────────────┐
│  Chrome extension │        │            Electron desktop app          │
│                   │        │                                          │
│  content-script   │        │  window-monitor ─┐                       │
│       │ DOM state │        │  capture-service ─┼─► detection-engine    │
│       ▼           │        │                   │   + app-heuristics    │
│  background  ─────┼─ Native│                   │   + stale-detection   │
│  (connectNative)  │ Messaging│                 ▼                       │
│                   │  (pipe) │  task-state ──► notification-service     │
│                   ├────────►│  storage (local JSON, electron-store)    │
└──────────────────┘        └─────────────────────────────────────────┘
```

**Detection** runs locally in two merged layers:

1. **Keyword rules** — substring matching over the window title (+ captured text), priority-ordered `CRITICAL → LOW`.
2. **App heuristics** — pattern matchers for known apps (VS Code, Chrome, Slack, Zoom).

Results merge by attention-severity: `FAILED > WAITING_FOR_USER > COMPLETED > RUNNING > ACTIVE > IDLE`. A real failure always beats a soft hint. See [`DETECTION_RULES.md`](DETECTION_RULES.md).

---

## Tech stack

| Layer | Tech |
|---|---|
| Desktop runtime | Electron |
| UI | React + TypeScript + Tailwind CSS |
| Build | electron-vite · Vite |
| Storage | Local JSON via electron-store (no cloud) |
| Detection | Rule-based engine + app heuristics (AI optional) |
| Bridge | Chrome Native Messaging over a local named pipe |
| Tests | Vitest |

---

## Project structure

```
deskkeeper/
├── app/                       Electron desktop app
│   ├── native-host/           Native messaging host (Node script Chrome spawns)
│   ├── src/main/              Main process — services, IPC, detection
│   ├── src/preload/           Context-isolated renderer bridge
│   ├── src/renderer/          React UI
│   └── src/shared/            Shared TypeScript types
├── extension/                 Chrome companion (MV3)
│   └── src/                   background · content-script · popup
└── *.md                       Product & engineering documentation
```

---

## Testing

```bash
cd app
pnpm test         # Vitest — 33 unit tests across detection, protocol, framing
pnpm typecheck    # tsc --noEmit
```

Unit tests cover the pure logic: detection merge, app heuristics, stale detection, the native-messaging framing codec, and the host↔app signal protocol.

---

## Roadmap

| Phase | Goal | Status |
|---|---|:---:|
| 0–9 | Docs → UI → monitor → detection → notifications → storage → OCR stub → extension → AI stub → packaging | ✅ |
| 10 | **Hardening**: Native Messaging bridge, stale/hang detection, app heuristics, title-parse capture | ✅ |

---

## Privacy & boundaries

DeskKeeper is built to **observe, classify, and notify** — deliberately not more.

- ✅ Only **user-selected** windows are watched — nothing by default.
- ✅ All detection is **local**. No screenshots are stored or transmitted.
- ✅ **Private mode** pauses all monitoring instantly.
- ✅ AI classification is **opt-in** and disabled by default.
- ❌ Never auto-clicks, auto-approves, or takes over your desktop.

See [`PRIVACY_SECURITY_MODEL.md`](PRIVACY_SECURITY_MODEL.md) and [`RISKS_AND_LIMITATIONS.md`](RISKS_AND_LIMITATIONS.md).

---

## Documentation

Product decisions live in markdown at the repo root. Start with [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) for the full picture, [`ROADMAP.md`](ROADMAP.md) for what's next, [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for common issues, and [`RELEASE_NOTES.md`](RELEASE_NOTES.md) for v0.1.0 changes.

<div align="center">
<br/>
<sub>Built by <b>ZeroOrigins AI</b> · local-first · privacy-first</sub>
</div>
