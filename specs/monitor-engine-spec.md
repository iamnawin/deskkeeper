# Window Monitor Engine Spec

## Purpose

List open windows on the user's desktop and provide their metadata to the detection engine.

## Interface

```typescript
interface OpenWindow {
  id: string;
  sourceId: string;        // desktopCapturer source ID
  title: string;
  appName: string;
  processName?: string;
  monitorId?: string;
  isMinimized?: boolean;
  lastSeenAt: string;
}

interface WindowMonitorService {
  getOpenWindows(): Promise<OpenWindow[]>;
  getWindowById(id: string): Promise<OpenWindow | null>;
}
```

## Implementation Approach

### Phase 1 (MVP): desktopCapturer

Use `desktopCapturer.getSources({ types: ['window'] })` to get window sources.

Each source provides:
- `id`: unique source ID
- `name`: window title
- `appIcon`: app icon (not used in MVP)
- `thumbnail`: screenshot (not used for detection in MVP — only metadata)

Limitations:
- Some apps may not expose their title correctly
- Background/minimized windows may not appear

### Phase 2: Native Module

Add `node-window-manager` for richer data:
- App executable path
- Window position and size
- Monitor assignment
- Z-order (foreground/background)

### Mock Fallback

If `desktopCapturer` fails, return hardcoded mock windows for development:
```typescript
const MOCK_WINDOWS: OpenWindow[] = [
  { id: 'mock-1', title: 'Claude Code — PowerShell', appName: 'Windows Terminal', ... },
  { id: 'mock-2', title: 'Vercel Dashboard — Chrome', appName: 'Google Chrome', ... },
  { id: 'mock-3', title: 'Gmail — Compose', appName: 'Google Chrome', ... },
]
```

## Privacy

- Do not capture screenshots in the monitor service
- Thumbnails from desktopCapturer are not stored or transmitted
- Monitor service only stores and returns metadata
