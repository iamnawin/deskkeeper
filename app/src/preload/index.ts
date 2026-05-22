import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('deskkeeper', {
  platform: process.platform,

  // Windows
  listWindows: () => ipcRenderer.invoke('windows:list'),
  watchWindow: (windowId: string) => ipcRenderer.invoke('windows:watch', windowId),
  unwatchWindow: (windowId: string) => ipcRenderer.invoke('windows:unwatch', windowId),
  getWatchedWindows: () => ipcRenderer.invoke('windows:watched-list'),

  // Task cards
  getTaskCards: () => ipcRenderer.invoke('taskCards:list'),
  updateTaskCardStatus: (cardId: string, status: string) =>
    ipcRenderer.invoke('taskCards:update-status', cardId, status),
  removeTaskCard: (cardId: string) => ipcRenderer.invoke('taskCards:remove', cardId),
  onTaskCardsUpdated: (callback: () => void) => {
    ipcRenderer.on('taskCards:updated', callback)
    return () => ipcRenderer.removeListener('taskCards:updated', callback)
  },

  // Detection rules
  getDetectionRules: () => ipcRenderer.invoke('detection:get-rules'),
  saveDetectionRule: (rule: object) => ipcRenderer.invoke('detection:save-rule', rule),
  deleteDetectionRule: (ruleId: string) => ipcRenderer.invoke('detection:delete-rule', ruleId),

  // Polling
  startPolling: () => ipcRenderer.invoke('polling:start'),
  stopPolling: () => ipcRenderer.invoke('polling:stop'),
  getPollingStatus: () => ipcRenderer.invoke('polling:status'),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (partial: object) => ipcRenderer.invoke('settings:save', partial),

  // Data management
  clearAllData: () => ipcRenderer.invoke('data:clear-all'),
  loadDemoFixtures: () => ipcRenderer.invoke('demo:load-fixtures'),
})
