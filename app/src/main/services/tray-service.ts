import { Tray, Menu, app, nativeImage, type BrowserWindow } from 'electron'
import { join } from 'path'
import { getSettings, saveSettings } from './storage-service'

let tray: Tray | null = null

// build/icon.ico ships beside the app source in dev and is copied to the
// resources dir in packaged builds (see extraResources in package.json).
function iconPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'icon.ico')
    : join(__dirname, '../../build/icon.ico')
}

export function createTray(show: () => void, quit: () => void): Tray {
  const img = nativeImage.createFromPath(iconPath())
  tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img)
  tray.setToolTip('DeskKeeper — watching your work')
  tray.on('click', show)
  buildMenu(show, quit)
  return tray
}

function buildMenu(show: () => void, quit: () => void): void {
  const menu = Menu.buildFromTemplate([
    { label: 'Open DeskKeeper', click: show },
    { type: 'separator' },
    {
      label: 'Private mode (pause all monitoring)',
      type: 'checkbox',
      checked: getSettings().privateModeEnabled,
      click: (item) => {
        saveSettings({ privateModeEnabled: item.checked })
        buildMenu(show, quit)
      },
    },
    { type: 'separator' },
    { label: 'Quit DeskKeeper', click: quit },
  ])
  tray?.setContextMenu(menu)
}

export function destroyTray(): void {
  tray?.destroy()
  tray = null
}

// Reflect the persisted launch-on-login preference into the OS. No-op in dev so
// we never register the throwaway dev Electron binary into the user's startup.
export function applyLoginItemSetting(enabled: boolean): void {
  if (!app.isPackaged) return
  app.setLoginItemSettings({ openAtLogin: enabled })
}

// The window is hidden to the tray on close rather than destroyed; helps the
// close handler distinguish a real quit from a hide.
export function wireWindowToTray(win: BrowserWindow, isQuitting: () => boolean): void {
  win.on('close', (e) => {
    if (isQuitting()) return
    e.preventDefault()
    win.hide()
  })
}
