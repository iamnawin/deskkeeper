import { Eye, EyeOff, Monitor } from 'lucide-react'
import { WatchedWindow } from '../../shared/types'

interface WindowCardProps {
  window: WatchedWindow
  onWatch?: (id: string) => void
  onUnwatch?: (id: string) => void
}

export default function WindowCard({ window: win, onWatch, onUnwatch }: WindowCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2a2d3a',
        borderRadius: '6px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <Monitor size={15} style={{ color: '#8b8fa8', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              color: '#e8eaf0',
              fontSize: '12px',
              fontFamily: 'Consolas, Monaco, monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {win.title}
          </p>
          <p style={{ color: '#5a5d70', fontSize: '11px', marginTop: '2px' }}>
            {win.appName}
            {win.monitorName ? ` · ${win.monitorName}` : ''}
          </p>
        </div>
      </div>

      <button
        onClick={() => win.isWatched ? onUnwatch?.(win.id) : onWatch?.(win.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
          flexShrink: 0,
          backgroundColor: win.isWatched ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          border: `1px solid ${win.isWatched ? 'rgba(99, 102, 241, 0.4)' : '#2a2d3a'}`,
          color: win.isWatched ? '#6366f1' : '#8b8fa8',
        }}
      >
        {win.isWatched ? (
          <>
            <Eye size={11} />
            Watching
          </>
        ) : (
          <>
            <EyeOff size={11} />
            Watch
          </>
        )}
      </button>
    </div>
  )
}
