# Claude Master Context Prompt — DeskKeeper AI

You are helping build DeskKeeper AI.

DeskKeeper AI is a desktop control tower for unfinished work across screens, apps, tabs, tools, uploads, drafts, forms, renders, terminals, and AI agents. This is not just a coding-agent approval watcher. It is a broader attention and continuity layer for modern multi-screen work.

---

## Core Problem

Users often work across many windows and monitors. They may have a terminal running, an AI coding agent waiting for approval, a video render completing, a browser upload pending final submit, an email draft unsent, a form partially completed, a deployment failed, or a meeting follow-up forgotten. When the user focuses on one window, other workflows can quietly become stuck or unfinished.

## Core Product Promise

DeskKeeper tells the user what needs attention before it gets forgotten.

---

## MVP Scope

Build a Windows-first Electron desktop app that lets the user:
1. View open windows
2. Select windows to watch
3. Track watched windows as task cards
4. Detect basic states: RUNNING | WAITING_FOR_USER | FAILED | COMPLETED | IDLE | UNKNOWN
5. Notify the user when a watched task needs attention
6. Let the user mark tasks done, ignored, or snoozed
7. Keep everything local-first
8. Provide privacy controls

---

## Do Not Build

- Full autonomous desktop control
- Auto-clicking or auto-approval
- Cloud screenshot upload
- Team collaboration features
- Complex AI agent behavior
- Chrome extension first (it is a companion, built in Phase 7)

---

## Architecture Direction

- **Electron** — main process (Node.js, OS access)
- **React** — renderer (UI)
- **TypeScript** — everywhere
- **Vite** — build tool
- **Tailwind CSS** — styling
- **electron-store** — local storage (MVP)
- **Modular services** (window-monitor, capture, detection, task-state, notification, storage, settings)

---

## Design Direction

Dark, clean, control-tower-style UI. Professional, calm, focused. Avoid toy-like AI branding.

---

## Coding Rules

- TypeScript with clear interfaces
- Small, single-responsibility functions
- Minimal dependencies
- Local-first, privacy-safe defaults
- If native implementation is hard → create abstraction + mock fallback
- Keep MVP simple — do not over-engineer

---

## How To Respond After Changes

Always explain:
1. What changed
2. Which files changed
3. Why the change was made
4. How to run/test it
5. What the next step should be

---

## Source of Truth

All product decisions are in the markdown files at the root of this repo. When in doubt, read those files first.
