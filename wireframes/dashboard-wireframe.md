# Dashboard Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  DeskKeeper  ●  Monitoring Active                      [⏸ Pause]│
├────────────┬────────────────────────────────────────────────────┤
│            │                                                     │
│ Dashboard  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐│
│            │  │ ⚠ Needs  │ │ ▶ Running│ │ ✓ Done   │ │ ⏸ Idle││
│ Watched    │  │ Attention│ │          │ │          │ │       ││
│ Windows    │  │    3     │ │    2     │ │    1     │ │   4   ││
│            │  └──────────┘ └──────────┘ └──────────┘ └───────┘│
│ Rules      │                                                     │
│            │  ── Needs Attention ─────────────────────────────  │
│ Settings   │                                                     │
│            │  ┌─────────────────────────────────────────────┐   │
│            │  │⚠ WAITING  PowerShell — Claude Code          │   │
│ ──────     │  │           Windows Terminal · 2 min ago      │   │
│            │  │ Detected: "Waiting for approval"            │   │
│ ⏸ Pause   │  │ Suggested: Review and provide input.         │   │
│ 🔒 Private │  │ [Focus] [Snooze ▼] [Done ✓] [Ignore ✕]    │   │
│            │  └─────────────────────────────────────────────┘   │
│            │                                                     │
│            │  ┌─────────────────────────────────────────────┐   │
│            │  │✕ FAILED  Vercel Dashboard                   │   │
│            │  │          Google Chrome · 5 min ago          │   │
│            │  │ Detected: "deployment failed"               │   │
│            │  │ Suggested: Review build logs and retry.     │   │
│            │  │ [Focus] [Snooze ▼] [Done ✓] [Ignore ✕]    │   │
│            │  └─────────────────────────────────────────────┘   │
│            │                                                     │
│            │  ── Running ─────────────────────────────────────  │
│            │                                                     │
│            │  ┌─────────────────────────────────────────────┐   │
│            │  │▶ RUNNING  Runway — Video Export             │   │
│            │  │           Chrome · 1 min ago                │   │
│            │  │ Detected: "rendering" in title              │   │
│            │  │ Suggested: No action needed yet.            │   │
│            │  │ [Focus] [Snooze ▼] [Done ✓] [Ignore ✕]    │   │
│            │  └─────────────────────────────────────────────┘   │
│            │                                                     │
└────────────┴────────────────────────────────────────────────────┘
```
