import { Notification } from 'electron'
import { saveNotificationEvent } from './storage-service'
import type { TaskCard, TaskStatus, UserSettings } from '../../shared/types'

const NOTIFY_STATUSES: TaskStatus[] = ['WAITING_FOR_USER', 'FAILED', 'COMPLETED']

// Per-card last-notification timestamp for cooldown tracking
const lastNotifiedAt = new Map<string, number>()

function shouldNotify(card: TaskCard, settings: UserSettings): boolean {
  if (!settings.notificationsEnabled) return false
  if (card.status === 'WAITING_FOR_USER' && !settings.notifyOnWaiting) return false
  if (card.status === 'FAILED' && !settings.notifyOnFailed) return false
  if (card.status === 'COMPLETED' && !settings.notifyOnCompleted) return false

  const last = lastNotifiedAt.get(card.id)
  if (last !== undefined) {
    const cooldownMs = settings.notificationCooldownMinutes * 60 * 1000
    if (Date.now() - last < cooldownMs) return false
  }

  return true
}

function buildMessage(card: TaskCard): { title: string; body: string } {
  const appLabel = card.appName ? ` — ${card.appName}` : ''
  switch (card.status) {
    case 'WAITING_FOR_USER':
      return { title: `Action needed${appLabel}`, body: card.suggestedAction ?? card.title }
    case 'FAILED':
      return { title: `Task failed${appLabel}`, body: card.suggestedAction ?? card.title }
    case 'COMPLETED':
      return { title: `Task done${appLabel}`, body: card.title }
    default:
      return { title: card.title, body: '' }
  }
}

export function maybeNotify(card: TaskCard, settings: UserSettings): void {
  if (!NOTIFY_STATUSES.includes(card.status)) return
  if (!shouldNotify(card, settings)) return
  if (!Notification.isSupported()) return

  const { title, body } = buildMessage(card)

  const n = new Notification({ title, body, silent: false })
  n.show()

  lastNotifiedAt.set(card.id, Date.now())

  saveNotificationEvent({
    id: `${card.id}-${Date.now()}`,
    taskId: card.id,
    status: card.status,
    title,
    body,
    createdAt: new Date().toISOString(),
  })
}
