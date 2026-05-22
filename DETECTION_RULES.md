# Detection Rules

## Overview

Rules are defined in `app/src/shared/detection-rules.ts` as `DetectionRule[]`. Each rule specifies a target status, a keyword list, and a suggested action. The detection engine scores each rule against the input and returns the highest-confidence match.

If no rule matches with sufficient confidence, return `UNKNOWN`.

---

## Rule: WAITING_FOR_USER

**Trigger**: Window title or visible text contains any of these keywords.

```
Keywords:
  approve, continue, proceed, allow, confirm, submit, publish, send, review,
  waiting for input, yes/no, accept changes, permission required, authorize,
  login required, sign in required, complete setup, final submit,
  waiting for approval, action required, input needed, awaiting
```

**Priority**: HIGH  
**Suggested action**: Review and provide input.

---

## Rule: FAILED

**Trigger**: Window title or visible text contains any of these keywords.

```
Keywords:
  failed, error, exception, denied, conflict, timeout, rate limit,
  upload failed, export failed, build failed, test failed, permission denied,
  deployment failed, render failed, connection lost, retry, rejected,
  blocked, crash, fatal, undefined, cannot, unable to
```

**Priority**: HIGH  
**Suggested action**: Review the error and retry or fix the issue.

---

## Rule: COMPLETED

**Trigger**: Window title or visible text contains any of these keywords.

```
Keywords:
  complete, completed, done, success, export ready, download ready,
  build passed, upload complete, render complete, deployment complete,
  ready to download, finished, all tests passed, successful
```

**Priority**: MEDIUM  
**Suggested action**: Review the completed output.

---

## Rule: DRAFT_OR_UNFINISHED

**Trigger**: Window title or visible text contains any of these keywords.

Maps to: `WAITING_FOR_USER`

```
Keywords:
  draft saved, unsent, required field, not submitted, changes not saved,
  compose, pending, incomplete, missing required, draft
```

**Priority**: MEDIUM  
**Suggested action**: Complete or send the unfinished item.

---

## Rule: RUNNING

**Trigger**: Window title or visible text contains any of these keywords.

```
Keywords:
  running, processing, rendering, uploading, building, deploying,
  generating, installing, loading, syncing, analyzing, in progress,
  working, please wait, initializing
```

**Priority**: LOW  
**Suggested action**: No action needed yet. Check back later.

---

## Rule: IDLE

**Trigger**: Time-based, not keyword-based.

```
Logic:
  - Task is in state: RUNNING, ACTIVE, or UNKNOWN
  - Window title has not changed for idleThresholdMinutes (default: 15)
  - Task is not SNOOZED, DONE, or IGNORED
  → Set state to IDLE
```

**Priority**: LOW  
**Suggested action**: Check if this task still matters.

---

## Rule: UNKNOWN (Fallback)

**Trigger**: No rule matches, or all rule matches are below confidence threshold.

**Priority**: NONE  
**Suggested action**: No action — state is unclear.

---

## Detection Priority Order

When multiple rules match, priority wins:
1. FAILED (highest confidence wins)
2. WAITING_FOR_USER
3. COMPLETED
4. RUNNING
5. IDLE (time-based)
6. UNKNOWN (fallback)

---

## Confidence Scoring

Confidence is calculated as:
```
confidence = matchedKeywordCount / totalKeywordsInRule (capped at 1.0)
```

A minimum confidence threshold of `0.3` is required to assign a non-UNKNOWN state. Below this, return `UNKNOWN`.

---

## Extending Rules

Rules are data-driven and stored in `detection-rules.ts`. Future UI will allow users to add/edit custom rules. For MVP, the file is the source of truth.
