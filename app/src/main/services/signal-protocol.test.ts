import { describe, it, expect } from 'vitest'
import { parseNdjson, isTabSignal } from './signal-protocol'

describe('parseNdjson', () => {
  it('parses one complete line and keeps no remainder', () => {
    const line = JSON.stringify({ tabId: 1, url: 'x', title: 'Tab' }) + '\n'
    const { signals, rest } = parseNdjson(line)
    expect(signals).toHaveLength(1)
    expect(signals[0].title).toBe('Tab')
    expect(rest).toBe('')
  })

  it('holds a partial trailing line as the remainder', () => {
    const full = JSON.stringify({ tabId: 1, url: 'x', title: 'A' }) + '\n'
    const partial = '{"tabId":2,"url":"y","ti'
    const { signals, rest } = parseNdjson(full + partial)
    expect(signals).toHaveLength(1)
    expect(rest).toBe(partial)
  })

  it('skips malformed and non-signal lines', () => {
    const buf = ['not json', JSON.stringify({ foo: 'bar' }), JSON.stringify({ tabId: 3, url: 'z', title: 'OK' })]
      .join('\n') + '\n'
    const { signals } = parseNdjson(buf)
    expect(signals).toHaveLength(1)
    expect(signals[0].tabId).toBe(3)
  })
})

describe('isTabSignal', () => {
  it('requires a numeric tabId and string title', () => {
    expect(isTabSignal({ tabId: 1, title: 'T' })).toBe(true)
    expect(isTabSignal({ tabId: '1', title: 'T' })).toBe(false)
    expect(isTabSignal({ title: 'T' })).toBe(false)
    expect(isTabSignal(null)).toBe(false)
  })
})
