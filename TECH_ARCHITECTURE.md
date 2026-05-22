# Technical Architecture

## Overview

DeskKeeper is an Electron desktop application with a React renderer frontend. The architecture separates concerns into: main process (Node.js/OS layer), preload bridge, renderer (React UI), and shared types.

```
┌─────────────────────────────────────────────┐
│              Renderer Process               │
│   React + TypeScript + Tailwind CSS (Vite)  │
│   Dashboard | Windows | Rules | Settings    │
└─────────────────┬───────────────────────────┘
                  │  contextBridge (IPC)
┌─────────────────┴───────────────────────────┐
│               Preload Script                │
│   Safe typed bridge between main & renderer │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│               Main Process                  │
│  Node.js + Electron APIs + OS access        │
│                                             │
│  Services:                                  │
│  ├── window-monitor-service                 │
│  ├── capture-service                        │
│  ├── detection-engine                       │
│  ├── task-state-engine                      │
│  ├── notification-service                   │
│  ├── storage-service                        │
│  └── settings-service                       │
│                                             │
│  IPC Handlers:                              │
│  ├── window-ipc                             │
│  ├── task-ipc                               │
│  └── settings-ipc                           │
└─────────────────────────────────────────────┘

Shared Layer (types + constants):
  └── src/shared/types.ts, constants.ts, detection-rules.ts, status.ts
```

---

## Main Process

The Electron main process runs in Node.js with full OS access. Responsibilities:
- Create and manage the app window
- Run monitoring services on a configurable interval
- Detect task states
- Emit desktop notifications
- Read/write local storage
- Expose data to renderer via IPC

---

## Preload Script

The preload script (`src/preload/index.ts`) acts as a secure typed bridge between the main process and the renderer. It uses `contextBridge.exposeInMainWorld` to expose a limited, typed API.

Rules:
- `nodeIntegration: false`
- `contextIsolation: true`
- No raw Node.js APIs exposed to renderer
- All IPC calls typed via the `ElectronAPI` interface in `shared/types.ts`

---

## Renderer Process

The React app runs in the renderer process. It:
- Has no direct OS or filesystem access
- Communicates with main process via `window.electronAPI`
- Uses Tailwind CSS for styling
- Uses Vite for fast hot-reload development

---

## Services

| Service | Purpose |
|---|---|
| `window-monitor-service` | List open windows via Electron/OS APIs, track watched state |
| `capture-service` | Abstraction for future screenshot/OCR — mock in MVP |
| `detection-engine` | Rule-based classification of window state from inputs |
| `task-state-engine` | Manage state transitions, enforce valid state machine |
| `notification-service` | Emit desktop notifications with debounce/cooldown logic |
| `storage-service` | Persist/retrieve all data using electron-store |
| `settings-service` | Read/write UserSettings, expose to IPC |

---

## IPC Layer

IPC handlers (`src/main/ipc/`) wire Electron `ipcMain` handlers to services. Each handler:
- Validates input
- Calls the relevant service
- Returns a typed response

Three IPC modules:
- `window-ipc.ts`: window listing, watch/unwatch
- `task-ipc.ts`: task card CRUD, state actions (snooze/done/ignore)
- `settings-ipc.ts`: read/write settings

---

## Shared Layer

`src/shared/` contains code used by both main and renderer processes:
- `types.ts`: all TypeScript interfaces (TaskCard, WatchedWindow, etc.)
- `constants.ts`: idle threshold, cooldown defaults, etc.
- `detection-rules.ts`: default detection rule definitions
- `status.ts`: TaskStatus enum + helpers

---

## Data Flow

```
[OS / Window APIs]
        │
[window-monitor-service] → polls open windows at interval
        │
[capture-service] → optionally reads visible text (Phase 2)
        │
[detection-engine] → classifies state using rules
        │
[task-state-engine] → applies state transition, updates TaskCard
        │
[storage-service] → persists TaskCard
        │
[notification-service] → fires desktop notification if needed
        │
[IPC] → pushes updated state to renderer
        │
[React Dashboard] → displays task cards
```
