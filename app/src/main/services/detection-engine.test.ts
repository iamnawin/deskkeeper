import { describe, it, expect } from 'vitest'
import { runDetection } from './detection-engine'
import type { DetectionInput, DetectionRule } from '../../shared/types'

const RULES: DetectionRule[] = [
  {
    id: 'rule-failed',
    label: 'Task Failed',
    status: 'FAILED',
    keywords: ['error', 'failed'],
    priority: 'HIGH',
    suggestedAction: 'Review the error.',
  },
  {
    id: 'rule-running',
    label: 'Task in Progress',
    status: 'RUNNING',
    keywords: ['building', 'rendering'],
    priority: 'MEDIUM',
    suggestedAction: 'Task is running.',
  },
]

function input(windowTitle: string, appName?: string): DetectionInput {
  return { windowId: 'w1', windowTitle, appName, now: '2026-05-31T10:00:00.000Z' }
}

describe('runDetection app-heuristic merge', () => {
  it('uses an app heuristic when no keyword rule matches', () => {
    const r = runDetection(input('(3) Inbox - Gmail - Google Chrome'), RULES)
    expect(r.status).toBe('WAITING_FOR_USER')
    expect(r.matchedRules).toEqual(['app:chrome'])
  })

  it('lets a more-urgent keyword rule win over a softer app hint', () => {
    // Chrome unread badge (WAITING) is present, but the title also says "failed".
    const r = runDetection(input('(2) Build failed - CI - Google Chrome'), RULES)
    expect(r.status).toBe('FAILED')
    expect(r.matchedRules).toEqual(['rule-failed'])
  })

  it('lets a more-urgent app heuristic win over a softer keyword rule', () => {
    // "rendering" matches RUNNING, but a not-responding page is FAILED (more urgent).
    const r = runDetection(input('Rendering preview - Google Chrome (Not Responding)'), RULES)
    expect(r.status).toBe('FAILED')
    expect(r.matchedRules).toEqual(['app:chrome'])
  })

  it('falls back to the default when nothing matches', () => {
    const r = runDetection(input('Untitled - Notepad'), RULES)
    expect(r.status).toBe('ACTIVE')
    expect(r.matchedRules).toEqual([])
  })
})
