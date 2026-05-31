import { ipcMain, BrowserWindow } from 'electron'
import { listOpenWindows } from '../services/window-monitor-service'
import { applyLoginItemSetting } from '../services/tray-service'
import {
  getWatchedWindows,
  saveWatchedWindow,
  removeWatchedWindow,
  getTaskCards,
  saveTaskCard,
  removeTaskCard,
  getDetectionRules,
  saveDetectionRule,
  removeDetectionRule,
  getSettings,
  saveSettings,
  clearUserData,
} from '../services/storage-service'
import { startPolling, stopPolling, isPolling } from '../services/polling-service'
import type { TaskCard, DetectionRule, UserSettings, WatchedWindow } from '../../shared/types'

export function registerWindowIpc(): void {
  ipcMain.handle('windows:list', async () => {
    const open = await listOpenWindows()
    const watched = getWatchedWindows()
    const watchedIds = new Set(watched.map(w => w.id))
    return open.map(w => ({ ...w, isWatched: watchedIds.has(w.id) }))
  })

  ipcMain.handle('windows:watched-list', () => getWatchedWindows())

  ipcMain.handle('windows:watch', async (_event, windowId: string) => {
    const open = await listOpenWindows()
    const win = open.find(w => w.id === windowId)
    if (!win) return
    const now = new Date().toISOString()
    saveWatchedWindow({ ...win, isWatched: true, createdAt: now, lastSeenAt: now })
    const card: TaskCard = {
      id: `tc-${windowId.replace(/[^a-z0-9]/gi, '-')}`,
      windowId,
      title: win.title,
      appName: win.appName,
      status: 'ACTIVE',
      priority: 'MEDIUM',
      lastSeenAt: now,
      lastStateChangeAt: now,
    }
    saveTaskCard(card)
  })

  ipcMain.handle('windows:watch-all', async () => {
    const open = await listOpenWindows()
    const watchedIds = new Set(getWatchedWindows().map(w => w.id))
    const now = new Date().toISOString()
    for (const win of open) {
      if (watchedIds.has(win.id)) continue
      saveWatchedWindow({ ...win, isWatched: true, createdAt: now, lastSeenAt: now })
      saveTaskCard({
        id: `tc-${win.id.replace(/[^a-z0-9]/gi, '-')}`,
        windowId: win.id,
        title: win.title,
        appName: win.appName,
        status: 'ACTIVE',
        priority: 'MEDIUM',
        lastSeenAt: now,
        lastStateChangeAt: now,
      })
    }
  })

  ipcMain.handle('windows:unwatch', (_event, windowId: string) => {
    removeWatchedWindow(windowId)
  })

  ipcMain.handle('taskCards:list', () => getTaskCards())

  ipcMain.handle('taskCards:update-status', (_event, cardId: string, status: TaskCard['status']) => {
    const cards = getTaskCards()
    const card = cards.find(c => c.id === cardId)
    if (!card) return
    saveTaskCard({ ...card, status, lastStateChangeAt: new Date().toISOString() })
  })

  ipcMain.handle('taskCards:remove', (_event, cardId: string) => {
    removeTaskCard(cardId)
  })

  ipcMain.handle('detection:get-rules', () => getDetectionRules())

  ipcMain.handle('detection:save-rule', (_event, rule: DetectionRule) => {
    saveDetectionRule(rule)
  })

  ipcMain.handle('detection:delete-rule', (_event, ruleId: string) => {
    removeDetectionRule(ruleId)
  })

  ipcMain.handle('polling:start', () => { startPolling() })
  ipcMain.handle('polling:stop', () => { stopPolling() })
  ipcMain.handle('polling:status', () => ({ running: isPolling() }))

  ipcMain.handle('settings:get', () => getSettings())
  ipcMain.handle('settings:save', (_event, partial: Partial<UserSettings>) => {
    saveSettings(partial)
    if (partial.launchOnLogin !== undefined) applyLoginItemSetting(partial.launchOnLogin)
  })

  ipcMain.handle('data:clear-all', () => { clearUserData() })

  ipcMain.handle('demo:load-fixtures', () => {
    const minsAgo = (n: number) => new Date(Date.now() - n * 60 * 1000).toISOString()
    const demoWindows: WatchedWindow[] = [
      { id: 'demo-w-001', title: 'PowerShell — Claude Code', appName: 'Windows PowerShell', processName: 'powershell.exe', isWatched: true, createdAt: minsAgo(120), lastSeenAt: minsAgo(2) },
      { id: 'demo-w-002', title: 'Vercel Dashboard — deskkeeper', appName: 'Google Chrome', processName: 'chrome.exe', isWatched: true, createdAt: minsAgo(90), lastSeenAt: minsAgo(10) },
      { id: 'demo-w-003', title: 'Runway — Video Export', appName: 'Google Chrome', processName: 'chrome.exe', isWatched: true, createdAt: minsAgo(60), lastSeenAt: minsAgo(1) },
      { id: 'demo-w-004', title: 'VS Code — deskkeeper', appName: 'Visual Studio Code', processName: 'code.exe', isWatched: true, createdAt: minsAgo(180), lastSeenAt: minsAgo(0) },
    ]
    const demoCards: TaskCard[] = [
      { id: 'demo-tc-001', windowId: 'demo-w-001', title: 'PowerShell — Claude Code', appName: 'Windows PowerShell', status: 'WAITING_FOR_USER', priority: 'HIGH', detectedReason: 'Waiting for user input detected', suggestedAction: 'Review and provide approval', lastSeenAt: minsAgo(2), lastStateChangeAt: minsAgo(5) },
      { id: 'demo-tc-002', windowId: 'demo-w-002', title: 'Vercel Dashboard — deskkeeper', appName: 'Google Chrome', status: 'FAILED', priority: 'CRITICAL', detectedReason: 'Deployment failed', suggestedAction: 'Review build logs and retry', lastSeenAt: minsAgo(10), lastStateChangeAt: minsAgo(12) },
      { id: 'demo-tc-003', windowId: 'demo-w-003', title: 'Runway — Video Export', appName: 'Google Chrome', status: 'RUNNING', priority: 'LOW', detectedReason: 'Export in progress', suggestedAction: 'Wait for export to complete', lastSeenAt: minsAgo(1), lastStateChangeAt: minsAgo(8) },
      { id: 'demo-tc-004', windowId: 'demo-w-004', title: 'VS Code — deskkeeper', appName: 'Visual Studio Code', status: 'ACTIVE', priority: 'MEDIUM', detectedReason: 'Active development session', lastSeenAt: minsAgo(0), lastStateChangeAt: minsAgo(30) },
    ]
    for (const w of demoWindows) saveWatchedWindow(w)
    for (const c of demoCards) saveTaskCard(c)
    BrowserWindow.getAllWindows()[0]?.webContents.send('taskCards:updated')
  })
}
