# Future Opportunities

## Near-Term (Post-MVP)

### OCR Detection
Use Tesseract.js to read visible text from window screenshots. This dramatically improves detection accuracy beyond window titles alone. Enables detection of:
- Form submission states
- Error messages in terminals
- Progress indicators
- Confirmation dialogs

### Smart Idle Rules
AI-assisted idle detection that learns which windows the user tends to leave open intentionally (reference docs, music player) vs. which are forgotten work.

### Keyboard Shortcut / Quick View
Global hotkey to pop up a mini DeskKeeper overlay showing "what needs attention" without switching to the full app.

---

## Medium-Term

### macOS Port
macOS has Accessibility API (`AXUIElement`) which provides rich window and UI element access. A macOS version could have more accurate detection than Windows in early phases.

### Agent Watcher Mode
Dedicated detection profiles for AI coding agents:
- Claude Code waiting for approval
- Codex paused at a checkpoint
- Gemini CLI waiting for input
- Cursor IDE background tasks

High-value for developer segment.

### Multi-Monitor View
Visual map of which task is on which screen, with drag-to-snooze and cross-monitor task card grouping.

---

## Long-Term

### Safe Action Layer
With explicit per-action confirmation, allow DeskKeeper to:
- Focus a specific window
- Click a known "OK" or "Dismiss" button
- Submit a form with one-time user approval

Not autonomous. Always requires user confirmation per action.

### Team DeskKeeper
Shared control tower for distributed teams:
- See what teammates have open/stuck
- Hand off tasks across team members
- Async status visibility

### Integration Marketplace
Third-party integrations that feed signals into DeskKeeper:
- GitHub PR review pending
- Linear ticket status changed
- Jira comment waiting for response
- Vercel build completed
- AWS alarm triggered

### DeskKeeper API
Let other tools push task signals into DeskKeeper via a local HTTP API. Any app can say "hey, this task needs the user."

---

## Monetization Path

| Tier | Features | Price |
|---|---|---|
| Free | Rule-based detection, basic notifications, 5 watched windows | $0 |
| Pro | OCR, AI classifier, unlimited windows, rules editor, advanced settings | $8/mo |
| Teams | Shared dashboards, team signals, workflow templates | $20/seat/mo |
| Enterprise | On-prem, SSO, audit logs, custom integrations | Custom |
