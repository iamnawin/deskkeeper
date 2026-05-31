import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import WindowCard from '../components/WindowCard'
import EmptyState from '../components/EmptyState'
import type { WatchedWindow } from '../../shared/types'

export default function WatchedWindows() {
  const [windows, setWindows] = useState<WatchedWindow[]>([])

  const refresh = useCallback(async () => {
    const list = await window.deskkeeper.listWindows()
    setWindows(list)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleWatch = useCallback(async (id: string) => {
    await window.deskkeeper.watchWindow(id)
    await refresh()
  }, [refresh])

  const handleWatchAll = useCallback(async () => {
    await window.deskkeeper.watchAllWindows()
    await refresh()
  }, [refresh])

  const handleUnwatch = useCallback(async (id: string) => {
    await window.deskkeeper.unwatchWindow(id)
    await refresh()
  }, [refresh])

  const watched = windows.filter(w => w.isWatched)
  const available = windows.filter(w => !w.isWatched)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '18px' }}>Watched Windows</h1>
        <button
          onClick={refresh}
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
          Refresh
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
              <WindowCard key={w.id} window={w} onUnwatch={handleUnwatch} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState message="No windows are being watched. Click a window below to start watching." />
      )}

      {available.length > 0 && (
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <h2
              style={{
                color: '#8b8fa8',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Available to Watch ({available.length})
            </h2>
            <button
              onClick={handleWatchAll}
              style={{
                padding: '5px 12px',
                borderRadius: '4px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#6366f1',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Watch All ({available.length})
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {available.map(w => (
              <WindowCard key={w.id} window={w} onWatch={handleWatch} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
