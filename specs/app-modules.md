# App Modules Spec

## Module Overview

| Module | Location | Responsibility |
|---|---|---|
| Main Process | `src/main/index.ts` | App lifecycle, window creation, service orchestration |
| Window IPC | `src/main/ipc/window-ipc.ts` | IPC handlers for window listing and watch/unwatch |
| Task IPC | `src/main/ipc/task-ipc.ts` | IPC handlers for task card CRUD and state actions |
| Settings IPC | `src/main/ipc/settings-ipc.ts` | IPC handlers for settings read/write |
| Window Monitor | `src/main/services/window-monitor-service.ts` | List open windows, track active windows |
| Capture | `src/main/services/capture-service.ts` | Screenshot/OCR abstraction (mock in MVP) |
| Detection Engine | `src/main/services/detection-engine.ts` | Classify window state from inputs |
| Task State Engine | `src/main/services/task-state-engine.ts` | Manage task state transitions |
| Notification | `src/main/services/notification-service.ts` | Desktop notifications with cooldown |
| Storage | `src/main/services/storage-service.ts` | Read/write electron-store |
| Settings | `src/main/services/settings-service.ts` | Settings access/update |
| Preload | `src/preload/index.ts` | contextBridge typed API |
| Renderer App | `src/renderer/App.tsx` | React root, routing |
| Dashboard | `src/renderer/pages/Dashboard.tsx` | Task card control tower |
| Watched Windows | `src/renderer/pages/WatchedWindows.tsx` | Window list and watch management |
| Rules | `src/renderer/pages/Rules.tsx` | Detection rules view |
| Settings | `src/renderer/pages/Settings.tsx` | Settings UI |
| Onboarding | `src/renderer/pages/Onboarding.tsx` | First-run flow |
| Shared Types | `src/shared/types.ts` | All TypeScript interfaces |
| Detection Rules | `src/shared/detection-rules.ts` | Default rule definitions |
| Constants | `src/shared/constants.ts` | App-wide constants |
| Status Helpers | `src/shared/status.ts` | TaskStatus enum helpers |

---

## Module Communication

```
Renderer → (IPC) → Main Process → Services → Storage/OS/Notification
Services → (IPC push) → Renderer (state updates)
```

Services do not import from renderer. Renderer does not import from main services directly. All communication via IPC + contextBridge.

---

## Monitoring Loop

The main process runs a monitoring loop on `captureIntervalSeconds` interval:
```
setInterval(() => {
  windows = windowMonitorService.getOpenWindows()
  for (watched of storage.getWatchedWindows()) {
    input = buildDetectionInput(watched, windows)
    result = detectionEngine.detect(input)
    updated = taskStateEngine.applyResult(taskCard, result)
    storage.updateTaskCard(updated)
    notificationService.maybeNotify(updated)
  }
  renderer.send('tasks-updated', storage.getTaskCards())
}, settings.captureIntervalSeconds * 1000)
```
