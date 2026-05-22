import type { WatchedWindow, TaskCard, TaskStatus, DetectionRule, UserSettings } from '../shared/types'

declare global {
  interface Window {
    deskkeeper: {
      platform: string

      listWindows: () => Promise<WatchedWindow[]>
      watchWindow: (windowId: string) => Promise<void>
      unwatchWindow: (windowId: string) => Promise<void>
      getWatchedWindows: () => Promise<WatchedWindow[]>

      getTaskCards: () => Promise<TaskCard[]>
      updateTaskCardStatus: (cardId: string, status: TaskStatus) => Promise<void>
      removeTaskCard: (cardId: string) => Promise<void>
      onTaskCardsUpdated: (callback: () => void) => () => void

      getDetectionRules: () => Promise<DetectionRule[]>
      saveDetectionRule: (rule: DetectionRule) => Promise<void>
      deleteDetectionRule: (ruleId: string) => Promise<void>

      startPolling: () => Promise<void>
      stopPolling: () => Promise<void>
      getPollingStatus: () => Promise<{ running: boolean }>

      getSettings: () => Promise<UserSettings>
      saveSettings: (partial: Partial<UserSettings>) => Promise<void>

      clearAllData: () => Promise<void>
      loadDemoFixtures: () => Promise<void>
    }
  }
}

export {}
