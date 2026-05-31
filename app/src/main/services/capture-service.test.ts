import { describe, it, expect } from 'vitest'
import { parseTitle, captureWindow } from './capture-service'

describe('parseTitle', () => {
  it('flattens em-dash and " - " separators', () => {
    expect(parseTitle('● index.ts — deskkeeper - Visual Studio Code')).toBe(
      '● index.ts deskkeeper Visual Studio Code',
    )
  })

  it('flattens pipe and middot separators', () => {
    expect(parseTitle('(12) Slack | general · ZeroOrigins')).toBe('(12) Slack general ZeroOrigins')
  })

  it('collapses repeated whitespace', () => {
    expect(parseTitle('Build    failed')).toBe('Build failed')
  })

  it('returns undefined for an empty or separator-only title', () => {
    expect(parseTitle('')).toBeUndefined()
    expect(parseTitle('  —  |  ')).toBeUndefined()
  })
})

describe('captureWindow', () => {
  it('returns the parsed title as visibleText', async () => {
    const result = await captureWindow('w1', 'Deploy - failed')
    expect(result.visibleText).toBe('Deploy failed')
  })

  it('returns undefined visibleText when no title is given', async () => {
    const result = await captureWindow('w1')
    expect(result.visibleText).toBeUndefined()
  })
})
