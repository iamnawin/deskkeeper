# Task Card Wireframe

## Standard Task Card

```
┌─────────────────────────────────────────────────────┐
│ ← 3px amber left border for WAITING_FOR_USER        │
│                                                     │
│ [⚠ WAITING]  PowerShell — Claude Code               │
│               Windows Terminal                      │
│               Last seen: 2 min ago                  │
│                                                     │
│ Detected:  "Waiting for approval" in window title   │
│ Suggested: Review and provide input.                │
│                                                     │
│ [→ Focus]  [Snooze ▾]  [✓ Done]  [✕ Ignore]       │
└─────────────────────────────────────────────────────┘
```

## FAILED Task Card

```
┌─────────────────────────────────────────────────────┐
│ ← 3px red left border                               │
│                                                     │
│ [✕ FAILED]  Vercel Dashboard                        │
│              Google Chrome                          │
│              Last seen: 5 min ago                   │
│                                                     │
│ Detected:  "deployment failed" in window title      │
│ Suggested: Review the error and retry or fix.       │
│                                                     │
│ [→ Focus]  [Snooze ▾]  [✓ Done]  [✕ Ignore]       │
└─────────────────────────────────────────────────────┘
```

## RUNNING Task Card

```
┌─────────────────────────────────────────────────────┐
│ ← 3px blue left border                              │
│                                                     │
│ [▶ RUNNING]  Runway — Video Export                  │
│               Google Chrome                         │
│               Last seen: 30 sec ago                 │
│                                                     │
│ Detected:  "rendering" in window title              │
│ Suggested: No action needed yet. Check back later.  │
│                                                     │
│ [→ Focus]  [Snooze ▾]  [✓ Done]  [✕ Ignore]       │
└─────────────────────────────────────────────────────┘
```

## SNOOZED Task Card (collapsed)

```
┌─────────────────────────────────────────────────────┐
│ ← 3px purple left border                            │
│                                                     │
│ [⏸ SNOOZED]  Gmail — Compose                       │
│               Resumes in 12 min                     │
│                                                     │
│ [Unsnooze]  [✓ Done]  [✕ Ignore]                   │
└─────────────────────────────────────────────────────┘
```

## Status Badge Variants

```
[⚠ WAITING]   amber background, amber text
[✕ FAILED]    red background, red text
[▶ RUNNING]   blue background, blue text
[✓ COMPLETED] green background, green text
[⏸ IDLE]      gray background, gray text
[? UNKNOWN]   dark gray background, muted text
[⏸ SNOOZED]  purple background, purple text
```
