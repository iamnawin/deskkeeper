import { useState, useEffect, useCallback } from 'react'
import StatusBadge from '../components/StatusBadge'
import type { DetectionRule } from '../../shared/types'

export default function Rules() {
  const [rules, setRules] = useState<DetectionRule[]>([])

  const refresh = useCallback(async () => {
    const list = await window.deskkeeper.getDetectionRules()
    setRules(list)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '18px', marginBottom: '4px' }}>
          Detection Rules
        </h1>
        <p style={{ color: '#8b8fa8', fontSize: '13px' }}>
          Rule-based detection engine. Rules are evaluated in priority order.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rules.map(rule => (
          <div
            key={rule.id}
            style={{
              backgroundColor: '#1a1d27',
              border: '1px solid #2a2d3a',
              borderRadius: '6px',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#e8eaf0', fontWeight: 500, fontSize: '13px' }}>{rule.label}</span>
              <StatusBadge status={rule.status} />
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  color: '#8b8fa8',
                  border: '1px solid #2a2d3a',
                }}
              >
                {rule.priority}
              </span>
            </div>
            <p
              style={{
                color: '#5a5d70',
                fontSize: '11px',
                fontFamily: 'Consolas, Monaco, monospace',
                marginBottom: '4px',
              }}
            >
              {rule.keywords.slice(0, 5).join(', ')}
              {rule.keywords.length > 5 ? ` +${rule.keywords.length - 5} more` : ''}
            </p>
            <p style={{ color: '#8b8fa8', fontSize: '12px', fontStyle: 'italic' }}>
              {rule.suggestedAction}
            </p>
          </div>
        ))}
        {rules.length === 0 && (
          <p style={{ color: '#5a5d70', fontSize: '13px' }}>No detection rules loaded.</p>
        )}
      </div>
    </div>
  )
}
