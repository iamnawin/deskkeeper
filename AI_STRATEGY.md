# AI Strategy

## Core Principle

**AI is not required for DeskKeeper to work.**

The rule-based detection engine is the default and must always function without any AI model. AI is an optional enhancement layer for ambiguous cases.

---

## Phase 1: Rule Engine (MVP)

Detection uses configurable keyword rules against:
- Window title
- App name
- Visible text snippet (when available)

This approach is:
- Fully local
- No API calls
- No cost
- Transparent (user can inspect rules)
- Fast (sub-millisecond per window)

The rule engine alone is sufficient for the MVP.

---

## Phase 2: OCR Layer

After the rule engine is stable, add OCR to extract visible text from window screenshots. This enables detection based on actual visible content rather than just the window title.

Implementation:
- Create a `capture-service` abstraction in MVP (as placeholder)
- Add Tesseract.js or similar for local OCR in Phase 2
- OCR output feeds into the same detection engine
- OCR can be disabled in settings (performance preference)

Privacy: OCR processing happens entirely locally. Screenshots are not stored or transmitted.

---

## Phase 3: Optional AI Classifier

Add an optional AI classifier as a third detection layer, used only when:
1. User has explicitly enabled AI classification in settings
2. Rule-based detection returns `UNKNOWN` or low confidence

AI classifier inputs:
- App/window title
- Visible text snippet (after redaction)
- Current rule-based detection result

AI classifier outputs:
- Refined status
- Confidence score
- Reasoning summary
- Suggested action

---

## Local vs Cloud AI Mode

| Mode | Description | Privacy |
|---|---|---|
| Disabled (default) | Rule engine only | Maximum privacy |
| Local model | Ollama / llama.cpp running locally | Data stays on device |
| Cloud model | API call to Claude / GPT | User must explicitly enable |

Cloud AI mode must:
- Redact sensitive text before sending
- Never send screenshots
- Be clearly disclosed in settings
- Be disabled by default

---

## What AI Will Never Do

In DeskKeeper:
- AI will never auto-click
- AI will never auto-approve actions
- AI will never execute desktop commands
- AI will never scrape sensitive form fields
- AI will never run without user consent

DeskKeeper is an attention recovery tool, not an autonomous agent. The AI layer only improves detection accuracy — it never takes action.
