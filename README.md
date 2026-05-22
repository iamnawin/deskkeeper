# DeskKeeper AI

> Your desktop control tower. Know what is waiting, failed, completed, or forgotten.

---

## What is DeskKeeper?

DeskKeeper AI is a **local-first desktop control tower** for unfinished work across screens, apps, tabs, tools, uploads, drafts, forms, renders, terminals, meetings, deployments, and AI agents.

Modern users work across many windows and monitors simultaneously. One screen may have a coding agent waiting for approval. Another may have a video render completing. Another may have an email draft unsent. Another may have a Vercel deployment failing silently.

DeskKeeper watches your open work and tells you what needs attention before it gets forgotten.

---

## One-Line Pitch

**DeskKeeper watches your open work and tells you what needs attention.**

---

## Who Is It For?

- Developers running terminals, agents, builds, and deployments
- AI creators managing renders, exports, and uploads
- Founders and operators handling proposals, emails, and CRM
- Business users juggling forms, drafts, and meeting follow-ups
- Students with assignments, notes, and submissions open
- Anyone working across 2+ screens and windows

---

## MVP Features (v0.1 — DeskKeeper Lite)

- View currently open windows
- Select windows to watch
- Watched windows become task cards
- Automatic state detection: `WAITING_FOR_USER`, `RUNNING`, `FAILED`, `COMPLETED`, `IDLE`, `UNKNOWN`
- Desktop notifications when attention is needed
- Snooze, mark done, or ignore tasks
- Local storage — no cloud required
- Privacy controls: private mode, pause monitoring, blocklist

---

## Tech Stack

| Layer | Tech |
|---|---|
| Desktop runtime | Electron |
| UI framework | React + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Storage | electron-store (MVP) |
| Detection | Rule-based engine (AI optional later) |

---

## How To Run (once app is built)

```bash
cd app
npm install
npm run dev
```

---

## Current Status

**Phase 0 — Documentation complete.**  
Next: Build Electron mock UI shell.

---

## Roadmap

| Phase | Goal |
|---|---|
| 0 | Documentation |
| 1 | Electron mock UI with dark dashboard |
| 2 | Window monitor + watched windows |
| 3 | Rule-based detection engine |
| 4 | Desktop notifications |
| 5 | Local storage persistence |
| 6 | OCR abstraction (placeholder) |
| 7 | Chrome extension companion |
| 8 | Optional AI classifier |
| 9 | Packaging + distribution |

---

## Documentation

All product decisions are captured in markdown files at the root of this repo. Start with `PROJECT_CONTEXT.md` for the full picture.
