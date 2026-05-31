import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerWindowIpc } from './ipc/window-ipc'
import { seedDefaultRules, flushStorage, getSettings } from './services/storage-service'
import { startPolling, stopPolling } from './services/polling-service'
import { startExtensionBridge, stopExtensionBridge } from './services/extension-bridge'
import { registerNativeHost } from './services/native-host-service'
import { createTray, destroyTray, applyLoginItemSetting, wireWindowToTray } from './services/tray-service'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f1117',
    icon: join(__dirname, '../../build/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })
  mainWindow = win
  wireWindowToTray(win, () => isQuitting)
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null
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
  registerNativeHost()
  startExtensionBridge()
  createTray(showWindow, () => app.quit())
  applyLoginItemSetting(getSettings().launchOnLogin)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else showWindow()
  })
})

function showWindow(): void {
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
  } else {
    createWindow()
  }
}

// DeskKeeper keeps watching from the tray after the window is closed, so this is
// intentionally a no-op — closing the window must not quit the app. Real exit
// goes through the tray's "Quit", which calls app.quit() → before-quit below.
app.on('window-all-closed', () => {})

app.on('before-quit', () => {
  isQuitting = true
  stopPolling()
  stopExtensionBridge()
  destroyTray()
  // Persist any debounced in-memory storage changes before the process exits.
  flushStorage()
})
