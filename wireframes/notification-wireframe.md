# Notification Wireframe

## Windows Toast Notification

```
┌──────────────────────────────────────────┐
│  DeskKeeper                    [✕]       │
│  ──────────────────────────────────────  │
│  PowerShell — Claude Code                │
│  Waiting for input — Review and          │
│  provide approval.                       │
└──────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────┐
│  DeskKeeper                    [✕]       │
│  ──────────────────────────────────────  │
│  Vercel Dashboard                        │
│  Deployment failed — Review build        │
│  logs and retry.                         │
└──────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────┐
│  DeskKeeper                    [✕]       │
│  ──────────────────────────────────────  │
│  Runway — Video Export                   │
│  Render completed — Download is ready.  │
└──────────────────────────────────────────┘
```

## Behavior

- Click anywhere on notification → DeskKeeper app comes to foreground
- [✕] button → dismiss notification (no action)
- Notifications appear in Windows Action Center
- Grouped under "DeskKeeper" in Action Center
- Cooldown: same task + same status will not fire again within 5 minutes

## Future Actions (Post-MVP)

```
┌──────────────────────────────────────────┐
│  DeskKeeper                    [✕]       │
│  ──────────────────────────────────────  │
│  PowerShell — Claude Code                │
│  Waiting for input                       │
│                                          │
│  [Focus Window]  [Snooze 15m]  [Done]   │
└──────────────────────────────────────────┘
```
