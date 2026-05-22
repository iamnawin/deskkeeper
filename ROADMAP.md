# Roadmap

## Phase 0 — Documentation (Current)

**Goal**: Complete project documentation before any code.

- [x] README
- [x] PROJECT_CONTEXT
- [x] PRODUCT_VISION
- [x] PROBLEM_STATEMENT
- [x] UNIQUE_INSIGHT
- [x] COMPETITOR_ANALYSIS
- [x] MVP_SCOPE
- [x] USE_CASES
- [x] USER_PERSONAS
- [x] PRODUCT_REQUIREMENTS
- [x] FUNCTIONAL_REQUIREMENTS
- [x] NON_FUNCTIONAL_REQUIREMENTS
- [x] TECH_ARCHITECTURE
- [x] TECH_STACK_DECISION
- [x] DESKTOP_APP_ARCHITECTURE
- [x] CHROME_EXTENSION_STRATEGY
- [x] AI_STRATEGY
- [x] PRIVACY_SECURITY_MODEL
- [x] DATA_MODEL
- [x] TASK_STATE_ENGINE
- [x] DETECTION_RULES
- [x] NOTIFICATION_STRATEGY
- [x] UX_FLOW
- [x] UI_SCREEN_SPECS
- [x] DESIGN_SYSTEM
- [x] RISKS_AND_LIMITATIONS
- [x] CLAUDE.md
- [x] /prompts folder
- [x] /research folder
- [x] /specs folder
- [x] /wireframes folder

---

## Phase 1 — Electron Mock UI

**Goal**: Working dark-theme desktop app with mock data. No real monitoring yet.

- [ ] Set up Electron + React + TypeScript + Vite + Tailwind
- [ ] Dark control-tower layout
- [ ] Sidebar navigation
- [ ] Dashboard page with mock task cards
- [ ] Watched Windows page (mock list)
- [ ] Rules page (read-only)
- [ ] Settings page
- [ ] Status badges: WAITING / RUNNING / FAILED / COMPLETED / IDLE / UNKNOWN
- [ ] Summary metric cards
- [ ] Task card with action buttons (mock)

---

## Phase 2 — Window Monitor + Watched Windows

**Goal**: List real open windows. Let user watch them. Show as task cards.

- [ ] `window-monitor-service` (with mock fallback)
- [ ] Window list UI connected to real data
- [ ] Watch/unwatch actions
- [ ] Watched windows become task cards
- [ ] `storage-service` with electron-store
- [ ] Persistence of watched state

---

## Phase 3 — Detection Engine

**Goal**: Classify watched windows into task states using rule-based detection.

- [ ] `detection-engine.ts`
- [ ] `detection-rules.ts` with initial keyword rules
- [ ] `task-state-engine.ts`
- [ ] Connect detection output to task cards
- [ ] Unit tests for detection engine

---

## Phase 4 — Notifications

**Goal**: Desktop notifications when tasks need attention.

- [ ] `notification-service.ts`
- [ ] Trigger on WAITING_FOR_USER and FAILED
- [ ] Cooldown/debounce logic
- [ ] Notification history stored locally
- [ ] Notification settings in Settings screen

---

## Phase 5 — Local Storage Polish

**Goal**: Complete storage layer. Settings persistence. State survives restarts.

- [ ] Complete StorageSchema
- [ ] Settings persistence
- [ ] Notification history
- [ ] Migration-safe structure

---

## Phase 6 — OCR Abstraction

**Goal**: Placeholder for OCR-based visible text detection.

- [ ] `capture-service.ts` abstraction
- [ ] Mock visible text input
- [ ] Connect to detection engine
- [ ] OCR disabled by default (toggle in settings)

---

## Phase 7 — Chrome Extension Companion

**Goal**: Browser-specific signal detection companion.

- [ ] Extension scaffold (Manifest V3)
- [ ] Tab title and URL detection
- [ ] Form state detection (permission-gated)
- [ ] Local bridge to Electron app
- [ ] Privacy messaging in extension

---

## Phase 8 — Optional AI Classifier

**Goal**: AI layer for ambiguous detection. Disabled by default.

- [ ] `ai-classifier-service.ts`
- [ ] Local model placeholder (Ollama)
- [ ] Cloud API mode (Claude / GPT) — opt-in
- [ ] PII redaction before any cloud call
- [ ] Settings toggle
- [ ] Graceful degradation when disabled

---

## Phase 9 — Packaging

**Goal**: Build a distributable Windows installer.

- [ ] Electron Builder configuration
- [ ] App icon
- [ ] NSIS installer for Windows
- [ ] Auto-launch on startup option
- [ ] Tray icon with quick actions
- [ ] Local development documentation
