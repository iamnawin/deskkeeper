// Chrome Native Messaging stdio framing: each message is a 4-byte little-endian
// uint32 length header followed by that many UTF-8 JSON bytes. Shared by the
// native host (runtime) and its unit test. Plain CommonJS — the host runs under
// Node (Electron launched with ELECTRON_RUN_AS_NODE=1), not through the bundler.

function encodeMessage(obj) {
  const json = Buffer.from(JSON.stringify(obj), 'utf8')
  const header = Buffer.alloc(4)
  header.writeUInt32LE(json.length, 0)
  return Buffer.concat([header, json])
}

// Returns a push(chunk) function that buffers incoming bytes and invokes
// onMessage(obj) for each complete frame, tolerating frames split across chunks.
function createFrameReader(onMessage) {
  let buf = Buffer.alloc(0)
  return function push(chunk) {
    buf = Buffer.concat([buf, chunk])
    while (buf.length >= 4) {
      const len = buf.readUInt32LE(0)
      if (buf.length < 4 + len) break
      const body = buf.subarray(4, 4 + len)
      buf = buf.subarray(4 + len)
      onMessage(JSON.parse(body.toString('utf8')))
    }
  }
}

module.exports = { encodeMessage, createFrameReader }
