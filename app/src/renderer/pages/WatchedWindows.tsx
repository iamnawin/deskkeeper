import { Plus } from 'lucide-react'
import WindowCard from '../components/WindowCard'
import EmptyState from '../components/EmptyState'
import { mockWindows } from '../lib/mock-data'

export default function WatchedWindows() {
  const watched = mockWindows.filter(w => w.isWatched)
  const available = mockWindows.filter(w => !w.isWatched)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '18px' }}>Watched Windows</h1>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '4px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#6366f1',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Add Window
        </button>
      </div>

      {watched.length > 0 ? (
        <section>
          <h2
            style={{
              color: '#8b8fa8',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            Currently Watching ({watched.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {watched.map(w => (
              <WindowCard key={w.id} window={w} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState message="No windows are being watched. Click 'Add Window' to start." />
      )}

      {available.length > 0 && (
        <section>
          <h2
            style={{
              color: '#8b8fa8',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            Available to Watch ({available.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {available.map(w => (
              <WindowCard key={w.id} window={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
