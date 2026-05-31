import { app } from 'electron'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { execFile } from 'child_process'

export const HOST_NAME = 'com.zeroorigins.deskkeeper'

// The unpacked extension's ID. After loading extension/dist in chrome://extensions,
// copy the ID shown there and set DESKKEEPER_EXTENSION_ID, or replace this default.
// The placeholder is intentionally non-functional so a misconfigured install fails
// loudly rather than accepting messages from any extension.
export const EXTENSION_ID =
  process.env.DESKKEEPER_EXTENSION_ID ?? 'replace-with-loaded-extension-id'

function hostScriptPath(): string {
  // Shipped via electron-builder extraResources in production; sits beside the
  // app source in development.
  const base = app.isPackaged ? process.resourcesPath : app.getAppPath()
  return join(base, 'native-host', 'deskkeeper-host.js')
}

// Register DeskKeeper as a Chrome native messaging host so the extension can
// reach the app with no listening network port. Windows-only for now: macOS and
// Linux place the host manifest in fixed Chrome profile directories instead of
// the registry (tracked for a later phase).
export function registerNativeHost(): void {
  if (process.platform !== 'win32') return

  const userData = app.getPath('userData')
  const launcher = join(userData, 'deskkeeper-host.cmd')
  const manifestPath = join(userData, 'deskkeeper-host.json')

  // Chrome runs the launcher; ELECTRON_RUN_AS_NODE makes the app binary behave
  // as a plain Node runtime that executes the host script.
  writeFileSync(
    launcher,
    `@echo off\r\nset ELECTRON_RUN_AS_NODE=1\r\n"${process.execPath}" "${hostScriptPath()}" %*\r\n`,
  )

  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        name: HOST_NAME,
        description: 'DeskKeeper browser companion native messaging host',
        path: launcher,
        type: 'stdio',
        allowed_origins: [`chrome-extension://${EXTENSION_ID}/`],
      },
      null,
      2,
    ),
  )

  const key = `HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${HOST_NAME}`
  execFile('reg', ['add', key, '/ve', '/t', 'REG_SZ', '/d', manifestPath, '/f'], () => {
    // best effort: a failed registry write only disables the browser companion,
    // it must never block app startup
  })
}
