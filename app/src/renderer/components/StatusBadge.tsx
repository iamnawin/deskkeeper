import { TaskStatus } from '../../shared/types'

const STATUS_MAP: Record<TaskStatus, { label: string; color: string }> = {
  WAITING_FOR_USER: { label: 'Waiting', color: '#f59e0b' },
  FAILED: { label: 'Failed', color: '#ef4444' },
  RUNNING: { label: 'Running', color: '#3b82f6' },
  COMPLETED: { label: 'Completed', color: '#22c55e' },
  IDLE: { label: 'Idle', color: '#6b7280' },
  UNKNOWN: { label: 'Unknown', color: '#374151' },
  SNOOZED: { label: 'Snoozed', color: '#8b5cf6' },
  ACTIVE: { label: 'Active', color: '#3b82f6' },
  DONE: { label: 'Done', color: '#22c55e' },
  IGNORED: { label: 'Ignored', color: '#374151' },
}

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, color } = STATUS_MAP[status] ?? STATUS_MAP.UNKNOWN
  return (
    <span
      style={{
        color,
        backgroundColor: `${color}26`,
        border: `1px solid ${color}66`,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
