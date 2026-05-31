import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import net from 'net'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { encodeMessage, createFrameReader } from './native-messaging.js'

// Integration test for the P1 Native Messaging transport: drives the real
// deskkeeper-host.js over stdio exactly as Chrome does (length-prefixed JSON)
// and asserts it bridges to / probes the local pipe correctly.

const here = dirname(fileURLToPath(import.meta.url))
const HOST = join(here, 'deskkeeper-host.js')
const PIPE =
  process.platform === 'win32' ? '\\\\.\\pipe\\deskkeeper-bridge' : '/tmp/deskkeeper-bridge.sock'

const delay = ms => new Promise(r => setTimeout(r, ms))

function startPipeServer(onLine) {
  return new Promise(resolve => {
    const server = net.createServer(socket => {
      let buf = ''
      socket.on('data', d => {
        buf += d.toString('utf8')
        let nl
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim()
          buf = buf.slice(nl + 1)
          if (line) onLine(line)
        }
      })
    })
    server.listen(PIPE, () => resolve(server))
  })
}

function startHost() {
  const child = spawn(process.execPath, [HOST], { stdio: ['pipe', 'pipe', 'ignore'] })
  const replies = []
  child.stdout.on('data', createFrameReader(m => replies.push(m)))
  return {
    send: obj => child.stdin.write(encodeMessage(obj)),
    waitReply: async () => {
      for (let i = 0; i < 50 && replies.length === 0; i++) await delay(20)
      return replies.shift()
    },
    kill: () => child.stdin.end(),
  }
}

describe('native host transport', () => {
  let host

  afterEach(async () => {
    host?.kill()
    await delay(50)
  })

  it('answers ping with electron:true and forwards a signal when the app is up', async () => {
    const lines = []
    const server = await startPipeServer(l => lines.push(l))
    host = startHost()

    host.send({ type: 'ping' })
    const pong = await host.waitReply()
    expect(pong).toMatchObject({ type: 'pong', electron: true })

    const signal = { tabId: 7, url: 'https://x.test/u', title: 'Upload — 80%' }
    host.send(signal)
    for (let i = 0; i < 50 && lines.length === 0; i++) await delay(20)
    expect(lines).toHaveLength(1)
    expect(JSON.parse(lines[0])).toMatchObject(signal)

    await new Promise(r => server.close(r))
  })

  it('answers ping with electron:false when the app is down', async () => {
    host = startHost()
    host.send({ type: 'ping' })
    const pong = await host.waitReply()
    expect(pong).toMatchObject({ type: 'pong', electron: false })
  })
})
