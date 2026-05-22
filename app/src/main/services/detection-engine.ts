import type { DetectionInput, DetectionResult, DetectionRule } from '../../shared/types'

const PRIORITY_ORDER: DetectionRule['priority'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export function runDetection(input: DetectionInput, rules: DetectionRule[]): DetectionResult {
  const haystack = [input.windowTitle, input.visibleText ?? ''].join(' ').toLowerCase()

  const sorted = [...rules].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  )

  for (const rule of sorted) {
    const matched = rule.keywords.filter(kw => haystack.includes(kw.toLowerCase()))
    if (matched.length > 0) {
      return {
        status: rule.status,
        confidence: Math.min(matched.length / rule.keywords.length, 1),
        detectedReason: rule.label,
        suggestedAction: rule.suggestedAction,
        matchedRules: [rule.id],
      }
    }
  }

  return {
    status: 'ACTIVE',
    confidence: 0.5,
    detectedReason: 'No detection rule matched',
    suggestedAction: '',
    matchedRules: [],
  }
}
