import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('deskkeeper', {
  platform: process.platform,
  listWindows: () => ipcRenderer.invoke('windows:list'),
  watchWindow: (windowId: string) => ipcRenderer.invoke('windows:watch', windowId),
  unwatchWindow: (windowId: string) => ipcRenderer.invoke('windows:unwatch', windowId),
  getWatchedWindows: () => ipcRenderer.invoke('windows:watched-list'),
  getTaskCards: () => ipcRenderer.invoke('taskCards:list'),
  updateTaskCardStatus: (cardId: string, status: string) =>
    ipcRenderer.invoke('taskCards:update-status', cardId, status),
  removeTaskCard: (cardId: string) => ipcRenderer.invoke('taskCards:remove', cardId),
})
