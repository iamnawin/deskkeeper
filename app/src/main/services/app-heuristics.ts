import type { DetectionInput, DetectionResult, TaskStatus } from '../../shared/types'

// App-specific title heuristics catch attention states that generic keyword
// rules miss: unsaved editors, unread badges, hung pages, live meetings.
// Each matcher is pattern-based (prefix / regex), not substring keywords.

type AppId = 'vscode' | 'chrome' | 'slack' | 'zoom'
type Match = Omit<DetectionResult, 'matchedRules'>

// Leading "(3)" badge that Chrome and Slack prepend for unread/notification counts.
const UNREAD_BADGE = /^\s*\((\d+)\)/

// Attention-severity order (most urgent first). Used to merge app heuristics
// with keyword detection so a real FAILED keyword still wins over a soft hint.
const SEVERITY: TaskStatus[] = [
  'FAILED', 'WAITING_FOR_USER', 'COMPLETED', 'RUNNING',
  'ACTIVE', 'IDLE', 'SNOOZED', 'UNKNOWN', 'DONE', 'IGNORED',
]

export function severityRank(status: TaskStatus): number {
  const i = SEVERITY.indexOf(status)
  return i === -1 ? SEVERITY.length : i
}

function identifyApp(input: DetectionInput): AppId | null {
  const app = (input.appName ?? '').toLowerCase()
  const hay = `${app} ${input.windowTitle.toLowerCase()}`
  if (app === 'code' || hay.includes('visual studio code')) return 'vscode'
  if (hay.includes('chrome')) return 'chrome'
  if (hay.includes('slack')) return 'slack'
  if (hay.includes('zoom')) return 'zoom'
  return null
}

function unreadBadge(title: string, noun: string): Match | null {
  const m = title.match(UNREAD_BADGE)
  if (!m) return null
  const n = m[1]
  return {
    status: 'WAITING_FOR_USER',
    confidence: 0.7,
    detectedReason: `${n} unread ${noun}`,
    suggestedAction: `You have ${n} unread ${noun} waiting.`,
  }
}

function matchVscode(title: string): Match | null {
  // VS Code prefixes the title with ● when the active file has unsaved changes.
  if (title.trimStart().startsWith('●')) {
    return {
      status: 'ACTIVE',
      confidence: 0.8,
      detectedReason: 'Unsaved changes in editor',
      suggestedAction: 'Save your work (Ctrl+S).',
    }
  }
  return null
}

function matchChrome(title: string): Match | null {
  if (title.toLowerCase().includes('not responding')) {
    return {
      status: 'FAILED',
      confidence: 0.9,
      detectedReason: 'Page not responding',
      suggestedAction: 'The page is unresponsive — wait or close the tab.',
    }
  }
  return unreadBadge(title, 'notifications')
}

function matchZoom(title: string): Match | null {
  // A live meeting window. Marking it RUNNING lets stale-detection later flag a
  // frozen/dropped call when the title stops updating (no stateful diff needed).
  if (title.toLowerCase().includes('zoom meeting')) {
    return {
      status: 'RUNNING',
      confidence: 0.7,
      detectedReason: 'In a Zoom meeting',
      suggestedAction: '',
    }
  }
  return null
}

const MATCHERS: Record<AppId, (title: string) => Match | null> = {
  vscode: matchVscode,
  chrome: matchChrome,
  slack: title => unreadBadge(title, 'messages'),
  zoom: matchZoom,
}

export function matchAppHeuristic(input: DetectionInput): DetectionResult | null {
  const app = identifyApp(input)
  if (!app) return null
  const result = MATCHERS[app](input.windowTitle)
  if (!result) return null
  return { ...result, matchedRules: [`app:${app}`] }
}
