import { describe, it, expect } from 'vitest'
import { encodeMessage, createFrameReader } from './native-messaging.js'

describe('native-messaging framing', () => {
  it('round-trips a single message', () => {
    const received = []
    const push = createFrameReader(m => received.push(m))
    push(encodeMessage({ type: 'ping', n: 1 }))
    expect(received).toEqual([{ type: 'ping', n: 1 }])
  })

  it('decodes two messages from one chunk', () => {
    const received = []
    const push = createFrameReader(m => received.push(m))
    push(Buffer.concat([encodeMessage({ a: 1 }), encodeMessage({ b: 2 })]))
    expect(received).toEqual([{ a: 1 }, { b: 2 }])
  })

  it('reassembles a frame split across chunks', () => {
    const received = []
    const push = createFrameReader(m => received.push(m))
    const frame = encodeMessage({ title: 'half-sent' })
    push(frame.subarray(0, 3)) // partial header
    expect(received).toEqual([])
    push(frame.subarray(3)) // remainder
    expect(received).toEqual([{ title: 'half-sent' }])
  })

  it('waits for a full body before emitting', () => {
    const received = []
    const push = createFrameReader(m => received.push(m))
    const frame = encodeMessage({ x: 'abcdef' })
    push(frame.subarray(0, frame.length - 2))
    expect(received).toEqual([])
    push(frame.subarray(frame.length - 2))
    expect(received).toHaveLength(1)
  })
})
