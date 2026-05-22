import { CircleDot, Pause } from 'lucide-react'

export default function TopBar() {
  return (
    <header
      style={{
        height: '44px',
        borderBottom: '1px solid #2a2d3a',
        backgroundColor: '#0f1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CircleDot size={11} style={{ color: '#22c55e' }} />
        <span style={{ color: '#8b8fa8', fontSize: '12px' }}>Monitoring Active</span>
      </div>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 12px',
          borderRadius: '4px',
          border: '1px solid #2a2d3a',
          background: 'none',
          color: '#8b8fa8',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        <Pause size={11} />
        Pause
      </button>
    </header>
  )
}
