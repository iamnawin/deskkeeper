import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, Play, CheckCircle, Clock } from 'lucide-react'
import SummaryMetricCard from '../components/SummaryMetricCard'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import type { TaskCard as TaskCardType, TaskStatus } from '../../shared/types'

const ATTENTION_STATUSES: TaskStatus[] = ['WAITING_FOR_USER', 'FAILED']
const RUNNING_STATUSES: TaskStatus[] = ['RUNNING', 'ACTIVE']
const COMPLETED_STATUSES: TaskStatus[] = ['COMPLETED', 'DONE']
const IDLE_STATUSES: TaskStatus[] = ['IDLE', 'UNKNOWN']

function groupCards(cards: TaskCardType[]) {
  return {
    attention: cards.filter(c => ATTENTION_STATUSES.includes(c.status)),
    running: cards.filter(c => RUNNING_STATUSES.includes(c.status)),
    completed: cards.filter(c => COMPLETED_STATUSES.includes(c.status)),
    idle: cards.filter(c => IDLE_STATUSES.includes(c.status)),
  }
}

function Section({ title, cards }: { title: string; cards: TaskCardType[] }) {
  if (cards.length === 0) return null
  return (
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
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cards.map(card => (
          <TaskCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  const [cards, setCards] = useState<TaskCardType[]>([])

  const refresh = useCallback(async () => {
    const list = await window.deskkeeper.getTaskCards()
    setCards(list)
  }, [])

  useEffect(() => {
    refresh()
    const cleanup = window.deskkeeper.onTaskCardsUpdated(refresh)
    return cleanup
  }, [refresh])

  const groups = groupCards(cards)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>
          Dashboard
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <SummaryMetricCard label="Needs Attention" count={groups.attention.length} icon={AlertTriangle} color="#f59e0b" />
          <SummaryMetricCard label="Running" count={groups.running.length} icon={Play} color="#3b82f6" />
          <SummaryMetricCard label="Completed" count={groups.completed.length} icon={CheckCircle} color="#22c55e" />
          <SummaryMetricCard label="Idle" count={groups.idle.length} icon={Clock} color="#6b7280" />
        </div>
      </div>

      <Section title="Needs Attention" cards={groups.attention} />
      <Section title="Running" cards={groups.running} />
      <Section title="Completed" cards={groups.completed} />
      <Section title="Idle" cards={groups.idle} />

      {cards.length === 0 && (
        <EmptyState message="No watched windows yet. Add windows from the Watched Windows tab to start monitoring." />
      )}
    </div>
  )
}
