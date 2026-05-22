# Privacy-First Design Research

## Why Privacy-First Is the Strategy

DeskKeeper watches your screen (selectively). That is inherently sensitive. The only way to build user trust is to make privacy the foundation — not an afterthought.

---

## Key Design Decisions

### 1. User-Selected Watchlist
No monitoring by default. The user must explicitly choose what to watch. This is the most important privacy decision in the product.

**Implementation**: No window is ever added to the watchlist without a user action. No auto-detection of "interesting" windows behind the user's back.

### 2. Local-First Processing
All detection logic runs on the user's machine. No window content, titles, or screenshots are sent to external servers by default.

**Implementation**: Rule-based detection engine in Electron main process. AI features require explicit opt-in and are clearly disclosed.

### 3. No Screenshot Storage
Even when screenshots are used for OCR (Phase 2+), they are not stored on disk or transmitted. They are processed in memory and discarded.

**Implementation**: `capture-service` returns extracted text, not the image. Image is never written to the storage layer.

### 4. Private Mode
A one-click kill switch for all monitoring. When activated:
- Monitoring loop stops immediately
- No new task state updates
- No notifications
- Tray icon changes to indicate private mode
- User can resume at any time

### 5. Visible Monitoring Indicator
The user must always know when DeskKeeper is monitoring. Never hidden or deceptive.

**Implementation**: Tray icon changes state (active/paused/private). Dashboard header shows "Monitoring Active" with a clear visual indicator.

---

## Privacy Copy Principles

- Be specific about what is monitored: "DeskKeeper monitors the windows you choose."
- Be specific about what is NOT done: "No screenshots are stored or uploaded."
- Use plain language, not legal disclaimers.
- Show privacy information before monitoring starts (onboarding).

---

## Regulatory Considerations

- GDPR (Europe): Local-only processing = minimal risk. If cloud AI is added, data processing disclosure required.
- CCPA (California): Similar — local processing is lowest risk tier.
- Enterprise deployment: Some enterprises may prohibit screen monitoring tools. Provide clear documentation of what data is collected/processed for enterprise buyers.

---

## Trust-Building Features (Future)

- Open-source the detection engine to allow community inspection
- Privacy audit log: show exactly what was captured and when
- Data export: let user download all stored data
- Account-less: no sign-in required, no user profile
