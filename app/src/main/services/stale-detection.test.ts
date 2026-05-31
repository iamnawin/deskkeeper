import { describe, it, expect } from 'vitest'
import { recordActivity, isStale } from './stale-detection'
import type { TaskCard, UserSettings } from '../../shared/types'

const baseCard: TaskCard = {
  id: 'c1',
  windowId: 'w1',
  title: 'Rendering 40%',
  status: 'RUNNING',
  priority: 'MEDIUM',
  lastSeenAt: '2026-05-31T10:00:00.000Z',
  lastStateChangeAt: '2026-05-31T10:00:00.000Z',
  lastActivityAt: '2026-05-31T10:00:00.000Z',
}

const settings: UserSettings = {
  notificationsEnabled: true,
  notifyOnWaiting: true,
  notifyOnFailed: true,
  notifyOnCompleted: false,
  notificationCooldownMinutes: 5,
  privateModeEnabled: false,
  monitoringPaused: false,
  useAiClassifier: false,
  captureIntervalSeconds: 10,
  staleThresholdMinutes: 10,
}

describe('recordActivity', () => {
  it('advances lastActivityAt when the title changes', () => {
    const now = '2026-05-31T10:05:00.000Z'
    const result = recordActivity(baseCard, 'Rendering 55%', now)
    expect(result.lastActivityAt).toBe(now)
    expect(result.title).toBe('Rendering 55%')
  })

  it('keeps prior lastActivityAt when the title is unchanged', () => {
    const now = '2026-05-31T10:05:00.000Z'
    const result = recordActivity(baseCard, 'Rendering 40%', now)
    expect(result.lastActivityAt).toBe('2026-05-31T10:00:00.000Z')
    expect(result.title).toBe('Rendering 40%')
  })

  it('falls back to lastStateChangeAt when lastActivityAt is absent', () => {
    const legacy = { ...baseCard, lastActivityAt: undefined }
    const now = '2026-05-31T10:05:00.000Z'
    const result = recordActivity(legacy, 'Rendering 40%', now)
    expect(result.lastActivityAt).toBe('2026-05-31T10:00:00.000Z')
  })
})

describe('isStale', () => {
  it('is true for a RUNNING window quiet past the threshold', () => {
    const now = '2026-05-31T10:11:00.000Z' // 11 min after activity, threshold 10
    expect(isStale('RUNNING', baseCard.lastActivityAt!, settings, now)).toBe(true)
  })

  it('is true exactly at the threshold boundary', () => {
    const now = '2026-05-31T10:10:00.000Z' // exactly 10 min
    expect(isStale('RUNNING', baseCard.lastActivityAt!, settings, now)).toBe(true)
  })

  it('is false for a RUNNING window still within the threshold', () => {
    const now = '2026-05-31T10:09:59.000Z'
    expect(isStale('RUNNING', baseCard.lastActivityAt!, settings, now)).toBe(false)
  })

  it('is false for non-RUNNING statuses even when quiet', () => {
    const now = '2026-05-31T11:00:00.000Z'
    expect(isStale('WAITING_FOR_USER', baseCard.lastActivityAt!, settings, now)).toBe(false)
    expect(isStale('COMPLETED', baseCard.lastActivityAt!, settings, now)).toBe(false)
    expect(isStale('IDLE', baseCard.lastActivityAt!, settings, now)).toBe(false)
  })
})
