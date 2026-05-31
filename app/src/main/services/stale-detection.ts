// Stale / hang detection for watched windows.
//
// A window can sit in RUNNING for a long time whether it is genuinely working
// (render progressing, build compiling) or frozen (app hung, waiting silently).
// The signal that separates the two is the window TITLE changing over time, not
// the task status changing. These pure helpers track that title-change activity
// and decide when an in-progress window has gone quiet long enough to be a hang.

import type { TaskCard, TaskStatus, UserSettings } from '../../shared/types'

// Statuses where a frozen title means "possibly stuck — a human should look".
// COMPLETED/FAILED/WAITING are terminal-ish or already actionable, so a static
// title there is expected and must not be re-flagged.
const HANG_CANDIDATE_STATUSES: TaskStatus[] = ['RUNNING']

export interface ActivityUpdate {
  lastActivityAt: string
  title: string
}

// Decide the window's activity timestamp for this tick. Activity = the title
// changed since we last observed it. When it has not changed we keep the prior
// activity time so staleness can accumulate. Cards created before this field
// existed fall back to lastStateChangeAt as a sane baseline.
export function recordActivity(card: TaskCard, currentTitle: string, now: string): ActivityUpdate {
  const previousActivity = card.lastActivityAt ?? card.lastStateChangeAt
  const titleChanged = currentTitle !== card.title
  return {
    lastActivityAt: titleChanged ? now : previousActivity,
    title: currentTitle,
  }
}

// True when an in-progress window has shown no title change for at least the
// configured threshold — it looks frozen/hung and warrants user attention.
export function isStale(
  status: TaskStatus,
  lastActivityAt: string,
  settings: UserSettings,
  now: string,
): boolean {
  if (!HANG_CANDIDATE_STATUSES.includes(status)) return false
  const thresholdMs = settings.staleThresholdMinutes * 60 * 1000
  const quietMs = new Date(now).getTime() - new Date(lastActivityAt).getTime()
  return quietMs >= thresholdMs
}
