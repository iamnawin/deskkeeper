import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerWindowIpc } from './ipc/window-ipc'
import { seedDefaultRules, flushStorage } from './services/storage-service'
import { startPolling, stopPolling } from './services/polling-service'
import { startExtensionBridge, stopExtensionBridge } from './services/extension-bridge'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f1117',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Required on Windows for Notification.show() to display toasts (especially
  // in dev / unpackaged runs). Must match the appId used at packaging time.
  if (process.platform === 'win32') app.setAppUserModelId('com.zeroorigins.deskkeeper')
  seedDefaultRules()
  registerWindowIpc()
  createWindow()
  startPolling()
  startExtensionBridge()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopPolling()
  stopExtensionBridge()
  if (process.platform !== 'darwin') app.quit()
})

// Persist any debounced in-memory storage changes before the process exits.
app.on('before-quit', () => {
  flushStorage()
})
