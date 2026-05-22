# Desktop App Architecture

## Why Desktop App

The desktop app is the core product. Not the browser extension, not a web app, not a mobile app.

**Reason**: The core problem — monitoring open work across all apps and screens — requires OS-level access. Only a desktop app can:
- List all open windows across all applications
- Access window metadata (title, process name, monitor info)
- Use `desktopCapturer` to optionally read visible content
- Emit native desktop notifications
- Monitor non-browser apps (terminals, VS Code, native tools, desktop apps)

---

## Window Monitoring

Electron provides access to window and display information via:
- `screen` API: monitor/display information
- `desktopCapturer.getSources()`: window source list (titles, thumbnails)
- Node.js child processes: query OS for process/window data (via PowerShell on Windows)

**MVP approach**: Use `desktopCapturer.getSources({ types: ['window', 'screen'] })` to get window titles and thumbnails. Title-based detection is the default detection input.

**Privacy**: Screenshots from `desktopCapturer` are never sent to cloud. In MVP, thumbnails are used only for detection logic locally. A future setting can disable all thumbnail capture.

---

## Multi-Screen Workflows

Electron's `screen` API provides:
- Display list with IDs and positions
- Active window information

DeskKeeper can eventually use display info to:
- Show which monitor a watched window is on
- Group task cards by screen/monitor

In MVP, monitor information is captured but not prominently exposed in UI.

---

## Privacy-Safe Monitoring

The desktop app model allows privacy to be enforced at the software level:
- User explicitly selects which windows to watch — no passive global capture
- `desktopCapturer` access is scoped and intentional
- No screenshot data is serialized to storage or transmitted
- Private mode instantly kills the monitoring loop
- Visible indicator (tray icon state) when monitoring is active

---

## Service Architecture on Main Process

All heavy work (window listing, detection, notifications, storage) runs in the Electron main process — not in the renderer. The renderer only displays state and sends user actions via IPC.

This keeps the UI responsive and maintains the security boundary.

---

## IPC Contract

The preload script exposes a typed `ElectronAPI` to the renderer. All IPC is:
- Explicitly named channels
- Typed request/response shapes defined in `shared/types.ts`
- Never exposes raw Node.js APIs to the renderer

---

## Future: Native Modules

For more accurate window listing (especially on Windows), native modules can be added:
- `node-window-manager`: enumerate windows, titles, positions
- `active-win`: get the currently focused window

These are deferred to Phase 2 after the mock/abstraction layer is established.
