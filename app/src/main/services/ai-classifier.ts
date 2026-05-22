// Optional AI classifier — third detection layer, runs only when:
//   1. settings.useAiClassifier === true (caller must check)
//   2. Rule-based detection returned low confidence
//
// Returns null when no API key is configured or AI is unavailable.
// To activate: set ANTHROPIC_API_KEY env var and replace the TODO block below.

import type { DetectionInput, DetectionResult } from '../../shared/types'

export async function classify(input: DetectionInput): Promise<DetectionResult | null> {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) return null

  // TODO: POST to https://api.anthropic.com/v1/messages
  // Redact sensitive fields before sending (no passwords, no form values).
  // Use input.windowTitle and input.visibleText only.
  // Map Claude response to DetectionResult shape.
  void input
  return null
}
