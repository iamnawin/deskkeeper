# Project Context

## Original Idea

The problem started with a personal experience: working across multiple screens with many tools running simultaneously — a coding agent in one terminal, a video render in a browser tab, an email draft open, a Vercel deployment in progress — and routinely forgetting about the others when focused on one thing.

Some of those windows fail silently. Some complete and wait. Some stall waiting for input. None of them interrupt unless you look.

DeskKeeper is the answer to: **"What is still waiting for me right now?"**

---

## The Core Problem

Modern knowledge workers, developers, AI creators, and founders work across:
- Multiple monitors
- Multiple terminals
- Multiple browser tabs
- Multiple AI tools
- Multiple apps open simultaneously

When they focus on one task, the others silently:
- Fail
- Complete
- Wait for approval
- Time out
- Stall forever
- Get forgotten

There is no system today that watches your open work and notifies you when something needs attention — across all apps, terminals, and windows — in a local-first, privacy-safe way.

---

## Product Belief

Attention is the scarcest resource in modern work. Most tools fight for it. DeskKeeper helps you recover it.

The key insight: **Task continuity is more valuable than task execution.** Most tools either do things for you (agents, automation) or remind you of things you haven't started (to-do lists). DeskKeeper watches things you are already doing and tells you when they need you back.

---

## What DeskKeeper Is

- A desktop control tower
- An attention recovery system
- A work continuity assistant
- A multi-screen workflow monitor
- A local-first productivity layer
- A task-state watcher

It should answer:
- What is still running?
- What needs my attention?
- What failed silently?
- What completed but I forgot?
- What draft / form / upload / render / deploy is unfinished?
- Which window should I return to next?

---

## What DeskKeeper Is Not

- A generic chatbot
- A simple reminder app
- A normal to-do list
- A full RPA bot
- A browser-only extension
- A screen recorder
- A spyware-style monitoring tool
- A full autonomous desktop agent
- A tool that clicks and approves things automatically (in MVP)

---

## MVP Direction

**Product name**: DeskKeeper AI  
**App display name**: DeskKeeper  
**MVP codename**: DeskKeeper Lite  
**Repo name**: deskkeeper-ai  
**First platform**: Windows desktop  
**Tech stack**: Electron + React + TypeScript + Vite + Tailwind CSS

The MVP should:
1. List open windows
2. Let the user select windows to watch
3. Show watched windows as task cards
4. Detect basic states using rule-based detection
5. Send desktop notifications
6. Let users snooze / done / ignore
7. Store everything locally

The MVP should NOT:
- Auto-click or auto-approve
- Upload screenshots to cloud
- Require an AI model to function
- Monitor all windows by default
- Require a Chrome extension
