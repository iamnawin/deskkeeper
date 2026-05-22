# Prompt: Add Optional AI Classifier

Add an optional AI classifier layer to DeskKeeper.

## Critical Rule

The rule-based detection engine remains the default. AI is optional and used only for ambiguous cases where rule engine returns `UNKNOWN` or low confidence. If AI is disabled, the app must work normally.

## File to Create

`src/main/services/ai-classifier-service.ts`

## Input

```typescript
interface AiClassifierInput {
  windowTitle: string;
  appName?: string;
  visibleTextSnippet?: string;    // max 500 chars, redacted
  ruleBasedResult: DetectionResult;
}
```

## Output

```typescript
interface AiClassifierResult {
  status: TaskStatus;
  confidence: number;
  reasoning: string;
  suggestedAction: string;
}
```

## Modes

| Mode | Description |
|---|---|
| Disabled (default) | Rule engine only, AI service not invoked |
| Local model | Route to Ollama / llama.cpp on localhost |
| Cloud API | Route to Claude / GPT API (HTTPS only) |

Mode is controlled by `UserSettings.useAiClassifier` and a config field for local vs cloud.

## PII Redaction

Before sending any text to a cloud model:
1. Strip email addresses
2. Strip phone numbers
3. Strip URLs with query params
4. Strip anything resembling API keys or tokens
5. Truncate to 500 chars

Never send screenshots to any cloud model.

## Settings

- `useAiClassifier: false` (default)
- UI toggle in Settings: "Use AI for ambiguous detection"
- Clear disclosure: "Text snippets may be sent to [provider] when enabled"

## Rules

- Do not add autonomous control
- Do not auto-click or auto-approve
- Do not make AI a hard dependency
- Graceful fallback to rule engine if AI call fails or is disabled
