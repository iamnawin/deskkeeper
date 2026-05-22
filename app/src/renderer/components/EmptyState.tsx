import { Monitor } from 'lucide-react'

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Monitor size={32} style={{ color: '#5a5d70' }} />
      <p style={{ color: '#8b8fa8', fontSize: '13px' }}>{message}</p>
    </div>
  )
}
