import { Clock, BellOff, CheckCircle, EyeOff } from 'lucide-react'
import { TaskCard as TaskCardType } from '../../shared/types'
import StatusBadge from './StatusBadge'

const STATUS_COLORS: Record<string, string> = {
  WAITING_FOR_USER: '#f59e0b',
  FAILED: '#ef4444',
  RUNNING: '#3b82f6',
  COMPLETED: '#22c55e',
  IDLE: '#6b7280',
  UNKNOWN: '#374151',
  SNOOZED: '#8b5cf6',
  ACTIVE: '#3b82f6',
  DONE: '#22c55e',
  IGNORED: '#374151',
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function TaskCard({ card }: { card: TaskCardType }) {
  const borderColor = STATUS_COLORS[card.status] ?? '#374151'

  return (
    <div
      style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2a2d3a',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '6px',
        padding: '14px 16px',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <p style={{ color: '#e8eaf0', fontWeight: 500, fontSize: '13px' }} className="truncate">
            {card.title}
          </p>
          {card.appName && (
            <p style={{ color: '#5a5d70', fontSize: '11px', fontFamily: 'Consolas, Monaco, monospace' }} className="mt-0.5">
              {card.appName}
            </p>
          )}
        </div>
        <StatusBadge status={card.status} />
      </div>

      {card.detectedReason && (
        <p style={{ color: '#8b8fa8', fontSize: '12px' }} className="mb-1">{card.detectedReason}</p>
      )}
      {card.suggestedAction && (
        <p style={{ color: '#5a5d70', fontSize: '12px', fontStyle: 'italic' }}>{card.suggestedAction}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span style={{ color: '#5a5d70', fontSize: '11px' }} className="flex items-center gap-1">
          <Clock size={11} />
          {formatRelativeTime(card.lastSeenAt)}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            title="Snooze"
            style={{ color: '#5a5d70', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#8b8fa8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5d70')}
          >
            <BellOff size={13} />
          </button>
          <button
            title="Mark done"
            style={{ color: '#5a5d70', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5d70')}
          >
            <CheckCircle size={13} />
          </button>
          <button
            title="Ignore"
            style={{ color: '#5a5d70', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#8b8fa8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5a5d70')}
          >
            <EyeOff size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
