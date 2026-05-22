# Desktop Agent Landscape

## Overview

Desktop agents are software products that take actions on the desktop (clicking, typing, navigating) on behalf of the user, typically using AI vision or accessibility APIs.

DeskKeeper is NOT a desktop agent. It is a desktop **observer**. Understanding the landscape helps clarify the positioning.

---

## Current Desktop Agent Products

### Claude Computer Use (Anthropic)
- Uses screenshot + LLM reasoning to control the desktop
- Full autonomous control capability
- Primarily for developer use cases and demos
- Privacy concern: requires sending screenshots to cloud

### OpenAI Operator
- Browser-focused autonomous task execution
- Fills out forms, navigates websites, clicks buttons
- Browser-only scope

### Manus
- General-purpose AI agent with desktop and web control
- Cloud-dependent
- Full task execution model

### UI-TARS (ByteDance)
- Vision-language model for desktop GUI interaction
- Academic/research focus, enterprise direction

### Open Interpreter
- Code execution + desktop control via natural language
- Developer tool
- Requires terminal / coding mindset

### Rabbit R1 / Humane Pin (hardware)
- Ambient AI assistants
- Context-aware but mobile-first

---

## What Desktop Agents Get Wrong (for DeskKeeper's Use Case)

1. They execute tasks — DeskKeeper watches them
2. They require active invocation — DeskKeeper runs passively
3. They are cloud-dependent — DeskKeeper is local-first
4. They take actions without user confirmation — DeskKeeper only notifies
5. They don't solve "what is currently waiting for me?" across all open work

---

## DeskKeeper's Positioning vs Agents

| Dimension | Desktop Agents | DeskKeeper |
|---|---|---|
| Role | Actor | Observer |
| Trigger | User invokes | Runs passively |
| Action | Clicks, types, navigates | Notifies |
| Privacy | Often cloud screenshots | Local-first |
| Scope | Assigned tasks | All open work |
| Risk | Autonomy risk | Low — read only |

---

## Future Convergence Risk

As desktop agents improve and become mainstream, they may add passive monitoring features. DeskKeeper should:
1. Build strong brand equity in the "observer / control tower" category
2. Establish the local-first, privacy-first positioning clearly
3. Reach users who explicitly do NOT want autonomous agents
