import { describe, it, expect } from 'vitest'
import { matchAppHeuristic, severityRank } from './app-heuristics'
import type { DetectionInput } from '../../shared/types'

function input(windowTitle: string, appName?: string): DetectionInput {
  return { windowId: 'w1', windowTitle, appName, now: '2026-05-31T10:00:00.000Z' }
}

describe('matchAppHeuristic', () => {
  it('flags VS Code unsaved changes from the ● prefix', () => {
    const r = matchAppHeuristic(input('● index.ts — deskkeeper', 'Code'))
    expect(r?.status).toBe('ACTIVE')
    expect(r?.detectedReason).toMatch(/unsaved/i)
    expect(r?.matchedRules).toEqual(['app:vscode'])
  })

  it('does not flag a saved VS Code file', () => {
    expect(matchAppHeuristic(input('index.ts — deskkeeper - Visual Studio Code'))).toBeNull()
  })

  it('reads Chrome unread badge count', () => {
    const r = matchAppHeuristic(input('(3) Inbox - Gmail - Google Chrome'))
    expect(r?.status).toBe('WAITING_FOR_USER')
    expect(r?.detectedReason).toBe('3 unread notifications')
  })

  it('flags a not-responding Chrome page as FAILED', () => {
    const r = matchAppHeuristic(input('Gmail - Google Chrome (Not Responding)'))
    expect(r?.status).toBe('FAILED')
  })

  it('reads Slack unread badge count', () => {
    const r = matchAppHeuristic(input('(12) Slack | general | ZeroOrigins'))
    expect(r?.status).toBe('WAITING_FOR_USER')
    expect(r?.detectedReason).toBe('12 unread messages')
  })

  it('marks a live Zoom meeting as RUNNING', () => {
    const r = matchAppHeuristic(input('Zoom Meeting', 'Zoom'))
    expect(r?.status).toBe('RUNNING')
  })

  it('returns null for an unrecognized app', () => {
    expect(matchAppHeuristic(input('Untitled - Notepad'))).toBeNull()
  })
})

describe('severityRank', () => {
  it('ranks FAILED more urgent than WAITING_FOR_USER and ACTIVE', () => {
    expect(severityRank('FAILED')).toBeLessThan(severityRank('WAITING_FOR_USER'))
    expect(severityRank('WAITING_FOR_USER')).toBeLessThan(severityRank('ACTIVE'))
  })
})
