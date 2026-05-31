// DeskKeeper native messaging host.
//
// Chrome launches this script (via the .cmd launcher written by
// native-host-service) whenever the extension opens a native port. It reads
// tab signals from the extension over stdio and forwards each one to the
// running Electron app through a local named pipe — no TCP port, no firewall
// surface. If the desktop app is down, signals are dropped silently, matching
// the previous HTTP bridge's behavior.

const net = require('net')
const { encodeMessage, createFrameReader } = require('./native-messaging')

const PIPE_PATH =
  process.platform === 'win32' ? '\\\\.\\pipe\\deskkeeper-bridge' : '/tmp/deskkeeper-bridge.sock'

function reply(obj) {
  process.stdout.write(encodeMessage(obj))
}

// Open a short-lived pipe connection, write one NDJSON line, then close.
function forward(signal) {
  const sock = net.connect(PIPE_PATH, () => {
    sock.write(JSON.stringify(signal) + '\n', () => sock.end())
  })
  sock.on('error', () => {}) // app not running — drop
}

// Resolve true only if the Electron pipe accepts a connection (app is up).
function probe() {
  return new Promise(resolve => {
    const sock = net.connect(PIPE_PATH, () => {
      sock.destroy()
      resolve(true)
    })
    sock.on('error', () => resolve(false))
    setTimeout(() => {
      sock.destroy()
      resolve(false)
    }, 1000)
  })
}

const push = createFrameReader(async msg => {
  if (msg && msg.type === 'ping') {
    reply({ type: 'pong', electron: await probe() })
    return
  }
  forward(msg)
})

process.stdin.on('data', push)
process.stdin.on('end', () => process.exit(0))
