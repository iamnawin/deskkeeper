import { LayoutDashboard, Monitor, SlidersHorizontal, Settings, PauseCircle, EyeOff } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Watched Windows', icon: Monitor, to: '/watched' },
  { label: 'Rules', icon: SlidersHorizontal, to: '/rules' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

const itemBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  background: 'none',
}

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '200px',
        backgroundColor: '#141720',
        borderRight: '1px solid #2a2d3a',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '18px 16px 14px' }}>
        <span style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '14px', letterSpacing: '-0.3px' }}>
          DeskKeeper
        </span>
      </div>

      <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...itemBase,
              color: isActive ? '#e8eaf0' : '#8b8fa8',
              backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
              borderLeft: `2px solid ${isActive ? '#6366f1' : 'transparent'}`,
              fontWeight: isActive ? 500 : 400,
              paddingLeft: '8px',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid #2a2d3a', padding: '8px' }}>
        <button style={{ ...itemBase, color: '#8b8fa8' }}>
          <PauseCircle size={15} />
          Pause
        </button>
        <button style={{ ...itemBase, color: '#8b8fa8' }}>
          <EyeOff size={15} />
          Private Mode
        </button>
      </div>
    </aside>
  )
}
