# Prompt: Build Window Monitor Service

Add a window monitor service to DeskKeeper.

## Goal

List currently open windows and display them in the Watched Windows screen. Let the user watch a window and see it appear as a task card on the dashboard.

## Requirements

1. Create `src/main/services/window-monitor-service.ts`
2. Return a list of open windows with:
   - `windowId` (unique identifier)
   - `title` (window title)
   - `appName` (application name if available)
   - `processName` (process name if available)
   - `sourceId` (desktopCapturer source ID)
   - `lastSeenAt` (timestamp)
3. Use `desktopCapturer.getSources()` where possible
4. Create a clean abstraction — if native listing is complex, provide a mock fallback
5. Expose via IPC (`window-ipc.ts`)
6. Update the renderer `WatchedWindows.tsx` to show real data
7. Let user click "Watch" — window is persisted to storage
8. Watched windows appear as task cards on Dashboard

## Privacy Rule

Do not capture screenshots yet. Only list window metadata (title, app name, process name).

## Storage

Use `storage-service.ts` to persist watched windows as `WatchedWindow[]`.

## After Implementation

Explain:
1. The abstraction approach used
2. What native APIs were used (or why mock was used)
3. Limitations of current approach
4. How to add native Windows window listing (e.g., `node-window-manager`) in Phase 3
