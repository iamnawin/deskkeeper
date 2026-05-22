import { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  count: number
  icon: LucideIcon
  color: string
}

export default function SummaryMetricCard({ label, count, icon: Icon, color }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#141720',
        border: '1px solid #2a2d3a',
        borderRadius: '6px',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{count}</p>
        <p style={{ fontSize: '11px', color: '#8b8fa8', marginTop: '6px' }}>{label}</p>
      </div>
      <Icon size={20} style={{ color, opacity: 0.7 }} />
    </div>
  )
}
