import type { DetectionInput, DetectionResult, DetectionRule } from '../../shared/types'
import { matchAppHeuristic, severityRank } from './app-heuristics'

const PRIORITY_ORDER: DetectionRule['priority'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

function matchKeywordRules(input: DetectionInput, rules: DetectionRule[]): DetectionResult {
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

export function runDetection(input: DetectionInput, rules: DetectionRule[]): DetectionResult {
  const keyword = matchKeywordRules(input, rules)
  const app = matchAppHeuristic(input)

  // App heuristics win when strictly more urgent than a matched keyword rule, or
  // whenever no keyword rule matched (so their richer signal beats the default).
  const appWins =
    app !== null &&
    (severityRank(app.status) < severityRank(keyword.status) || keyword.matchedRules.length === 0)

  return appWins ? app! : keyword
}
