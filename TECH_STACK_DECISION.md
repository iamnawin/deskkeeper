# Tech Stack Decision

## Why Electron First

**Decision**: Electron desktop app as the primary product, not a browser extension.

**Rationale**:
- Browser extensions cannot access non-browser apps (terminals, VS Code, native tools).
- The core value proposition is cross-app, cross-window monitoring — only achievable from the desktop layer.
- Electron gives access to OS-level window metadata, `desktopCapturer`, and `Notification` API.
- A desktop app can later consume a Chrome extension's signals as a companion — the reverse is not true.
- Privacy: local-first processing is far easier to guarantee in a desktop app than an extension.

**Trade-off**: Electron apps are heavier than pure web apps. Mitigated by keeping the app minimal and not loading unnecessary Node modules.

---

## Why React + TypeScript

**Decision**: React with TypeScript for the renderer.

**Rationale**:
- TypeScript enforces the shared type contracts between main and renderer processes.
- React's component model maps naturally to the card-based dashboard UI.
- Large ecosystem for UI components and utilities.
- Team familiarity and hiring pool.

**Alternative considered**: Svelte (lighter, simpler). Rejected because React's ecosystem is larger and the team is more comfortable with it.

---

## Why Vite

**Decision**: Vite as the build tool (via `electron-vite`).

**Rationale**:
- Fast hot-reload for both renderer and main process.
- `electron-vite` provides a purpose-built Electron + Vite integration.
- Significantly faster than Webpack for development.

---

## Why Tailwind CSS

**Decision**: Tailwind CSS for styling.

**Rationale**:
- Utility-first approach enables fast, consistent dark-theme UI construction.
- No context switching between CSS files and components.
- Tailwind's dark mode support is well-suited for the control-tower visual style.

---

## Why electron-store for MVP Storage

**Decision**: `electron-store` for MVP, SQLite as the upgrade path.

**Rationale**:
- `electron-store` is simple, zero-config JSON storage — perfect for MVP.
- No database setup, no migrations needed in Phase 1.
- The `storage-service` abstraction allows swapping to SQLite later without touching consumers.

**Future**: SQLite (via `better-sqlite3`) when query complexity or data volume requires it.

---

## Why Rule-Based Detection First

**Decision**: Rule-based keyword matching before any AI/OCR.

**Rationale**:
- Works without internet, without an AI model, without user data leaving the device.
- Fast: runs locally in microseconds.
- Transparent: users can inspect and modify rules.
- Sufficient for MVP: window titles contain enough signal for WAITING_FOR_USER, FAILED, COMPLETED detection.

**AI classifier**: Optional enhancement. Must be explicitly enabled. Never a hard dependency.

---

## Future: Tauri

**Consideration**: Tauri (Rust-based Electron alternative) could reduce bundle size and memory footprint significantly.

**Decision for now**: Electron is chosen for faster development velocity and mature ecosystem. Tauri is a viable future migration if performance or bundle size becomes a user complaint.
