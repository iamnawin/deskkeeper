import { ipcMain } from 'electron'
import { listOpenWindows } from '../services/window-monitor-service'
import {
  getWatchedWindows,
  saveWatchedWindow,
  removeWatchedWindow,
  getTaskCards,
  saveTaskCard,
  removeTaskCard,
} from '../services/storage-service'
import type { TaskCard } from '../../shared/types'

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
}
