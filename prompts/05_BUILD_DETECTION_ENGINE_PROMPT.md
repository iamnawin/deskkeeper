# Prompt: Build Rule-Based Detection Engine

Build the first version of DeskKeeper's detection engine.

## Goal

Classify watched window metadata into task states using configurable keyword rules.

## Files to Create

- `src/main/services/detection-engine.ts`
- `src/shared/detection-rules.ts`

## Input Interface

```typescript
interface DetectionInput {
  windowId: string;
  windowTitle: string;
  appName?: string;
  visibleText?: string;
  previousStatus?: TaskStatus;
  lastActivityAt?: string;
  now: string;
}
```

## Output Interface

```typescript
interface DetectionResult {
  status: TaskStatus;
  confidence: number;       // 0.0 – 1.0
  detectedReason: string;
  suggestedAction: string;
  matchedRules: string[];
}
```

## Initial Rules

See `DETECTION_RULES.md` for full keyword lists per category:
- `WAITING_FOR_USER`: approve, confirm, submit, publish, waiting for input, etc.
- `FAILED`: failed, error, exception, denied, timeout, build failed, etc.
- `COMPLETED`: complete, done, success, export ready, download ready, etc.
- `RUNNING`: running, processing, rendering, uploading, building, etc.
- `IDLE`: time-based — no title change for idleThresholdMinutes

## Rules

1. Keep rules configurable in `detection-rules.ts` — do not hardcode in engine
2. Do not over-classify. Return `UNKNOWN` when confidence < 0.3
3. Priority order: FAILED > WAITING_FOR_USER > COMPLETED > RUNNING > IDLE > UNKNOWN
4. Add unit tests for detection logic
5. Connect detection result to task cards

## After Implementation

Explain:
1. Files created
2. How confidence is calculated
3. Test results
4. Next step (Phase 4: notifications)
