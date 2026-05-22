import type { WatchedWindow, TaskCard, TaskStatus } from '../shared/types'

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
    }
  }
}

export {}
