# Detection Engine Spec

## Purpose

Classify a watched window into a `TaskStatus` based on available inputs (window title, app name, visible text, time elapsed).

## Function Signature

```typescript
function detect(input: DetectionInput): DetectionResult
```

## Algorithm

```
1. Normalize inputs (lowercase, trim)
2. For each DetectionRule (ordered by priority):
   a. Count keyword matches against (title + appName + visibleText)
   b. Calculate confidence = matchCount / totalKeywords (capped at 1.0)
   c. If confidence >= MIN_CONFIDENCE (0.3): record as candidate
3. If any candidates: return highest-confidence candidate
4. If no candidates and IDLE condition met: return IDLE
5. Otherwise: return UNKNOWN
```

## Priority Order

When multiple rules match above threshold:
1. FAILED
2. WAITING_FOR_USER
3. COMPLETED
4. RUNNING
5. IDLE (time-based)
6. UNKNOWN (fallback)

## Confidence Calculation

```typescript
function confidence(matchedKeywords: number, totalKeywords: number): number {
  return Math.min(matchedKeywords / totalKeywords, 1.0);
}
```

Minimum confidence threshold: `0.3` (at least 30% of keywords must match).

## IDLE Detection

IDLE is triggered when:
```typescript
const elapsedMs = now - lastActivityAt;
const thresholdMs = settings.idleThresholdMinutes * 60 * 1000;
const isEligible = ['RUNNING', 'ACTIVE', 'UNKNOWN'].includes(previousStatus);
return elapsedMs > thresholdMs && isEligible;
```

## Error Handling

- If input is null/undefined: return `{ status: 'UNKNOWN', confidence: 0, ... }`
- Detection engine must never throw — always return a result
- Log unexpected inputs to logger

## Testing

Test cases required:
- Title "Waiting for approval" → WAITING_FOR_USER
- Title "Build failed" → FAILED
- Title "Deployment complete" → COMPLETED
- Title "Uploading..." → RUNNING
- Title "VS Code - myapp.ts" (no keywords) → UNKNOWN
- Window with no title change for 20 minutes → IDLE
