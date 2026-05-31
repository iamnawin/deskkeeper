import { useState, useEffect, useCallback } from 'react'
import type { UserSettings } from '../../shared/types'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: value ? '#6366f1' : '#2a2d3a',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 0.15s',
      }}
      aria-checked={value}
      role="switch"
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: value ? '18px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.15s',
        }}
      />
    </button>
  )
}

function SettingRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #2a2d3a',
      }}
    >
      <span style={{ color: '#e8eaf0', fontSize: '13px' }}>{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2a2d3a',
        borderRadius: '6px',
        padding: '0 16px',
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      style={{
        color: '#8b8fa8',
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '8px',
      }}
    >
      {title}
    </h2>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    window.deskkeeper.getSettings().then(s => setSettings(s))
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])

  function set<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    if (!settings) return
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    window.deskkeeper.saveSettings({ [key]: value })
  }

  function handleNumberBlur<K extends keyof UserSettings>(key: K, value: number) {
    if (!settings) return
    set(key, value as UserSettings[K])
  }

  async function handleClearData() {
    if (!window.confirm('This will remove all watched windows and task cards. Continue?')) return
    await window.deskkeeper.clearAllData()
    showToast('Data cleared')
    setTimeout(() => window.location.reload(), 800)
  }

  async function handleLoadDemo() {
    await window.deskkeeper.loadDemoFixtures()
    showToast('Demo data loaded — go to Dashboard')
  }

  if (!settings) {
    return (
      <div style={{ color: '#5a5d70', fontSize: '13px', padding: '24px 0' }}>
        Loading settings...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '520px', position: 'relative' }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1a1d27',
            border: '1px solid #2a2d3a',
            borderRadius: '6px',
            padding: '10px 16px',
            color: '#22c55e',
            fontSize: '13px',
            zIndex: 100,
          }}
        >
          {toast}
        </div>
      )}

      <h1 style={{ color: '#e8eaf0', fontWeight: 600, fontSize: '18px' }}>Settings</h1>

      <section>
        <SectionHeader title="Notifications" />
        <SectionCard>
          <SettingRow label="Enable notifications" value={settings.notificationsEnabled} onChange={v => set('notificationsEnabled', v)} />
          <SettingRow label="Notify when waiting for input" value={settings.notifyOnWaiting} onChange={v => set('notifyOnWaiting', v)} />
          <SettingRow label="Notify when task fails" value={settings.notifyOnFailed} onChange={v => set('notifyOnFailed', v)} />
          <SettingRow label="Notify when task completes" value={settings.notifyOnCompleted} onChange={v => set('notifyOnCompleted', v)} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ color: '#e8eaf0', fontSize: '13px' }}>Notification cooldown</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.notificationCooldownMinutes}
                onChange={e => setSettings(s => s ? { ...s, notificationCooldownMinutes: parseInt(e.target.value) || 5 } : s)}
                onBlur={e => handleNumberBlur('notificationCooldownMinutes', parseInt(e.target.value) || 5)}
                style={{
                  width: '52px',
                  padding: '4px 8px',
                  backgroundColor: '#0f1117',
                  border: '1px solid #2a2d3a',
                  borderRadius: '4px',
                  color: '#e8eaf0',
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              />
              <span style={{ color: '#5a5d70', fontSize: '12px' }}>min</span>
            </div>
          </div>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="Monitoring" />
        <SectionCard>
          <SettingRow label="Pause monitoring" value={settings.monitoringPaused} onChange={v => set('monitoringPaused', v)} />
          <SettingRow label="Private mode" value={settings.privateModeEnabled} onChange={v => set('privateModeEnabled', v)} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <span style={{ color: '#e8eaf0', fontSize: '13px' }}>Capture interval</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={5}
                max={60}
                value={settings.captureIntervalSeconds}
                onChange={e => setSettings(s => s ? { ...s, captureIntervalSeconds: parseInt(e.target.value) || 10 } : s)}
                onBlur={e => handleNumberBlur('captureIntervalSeconds', parseInt(e.target.value) || 10)}
                style={{
                  width: '52px',
                  padding: '4px 8px',
                  backgroundColor: '#0f1117',
                  border: '1px solid #2a2d3a',
                  borderRadius: '4px',
                  color: '#e8eaf0',
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              />
              <span style={{ color: '#5a5d70', fontSize: '12px' }}>sec</span>
            </div>
          </div>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="AI" />
        <SectionCard>
          <SettingRow label="Use AI for ambiguous detection" value={settings.useAiClassifier} onChange={v => set('useAiClassifier', v)} />
          <p style={{ color: '#5a5d70', fontSize: '11px', paddingBottom: '10px' }}>
            When enabled, window title snippets may be processed by an AI model. Requires ANTHROPIC_API_KEY.
          </p>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="Deep capture" />
        <SectionCard>
          <SettingRow label="Read terminals & editors via on-screen OCR" value={settings.ocrCaptureEnabled} onChange={v => set('ocrCaptureEnabled', v)} />
          <p style={{ color: '#5a5d70', fontSize: '11px', paddingBottom: '10px' }}>
            Some apps (terminals inside VS Code / Antigravity) hide their text from accessibility. When enabled, DeskKeeper reads those windows by capturing the screen image and recognizing the text locally — the image is processed on your machine and discarded, never uploaded. Only runs for windows whose text is otherwise unreadable. Off by default.
          </p>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="Startup" />
        <SectionCard>
          <SettingRow label="Launch on login & run in tray" value={settings.launchOnLogin} onChange={v => set('launchOnLogin', v)} />
          <p style={{ color: '#5a5d70', fontSize: '11px', paddingBottom: '10px' }}>
            Starts DeskKeeper automatically when you log in and keeps it watching from the system tray, so the app and browser companion stay connected without opening it manually. Applies to the installed app.
          </p>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="Demo" />
        <SectionCard>
          <div style={{ padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleLoadDemo}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#6366f1',
                fontSize: '13px',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              Load demo data
            </button>
            <p style={{ color: '#5a5d70', fontSize: '11px' }}>
              Seeds representative task cards for demo or testing. Safe to run multiple times.
            </p>
          </div>
        </SectionCard>
      </section>

      <section>
        <SectionHeader title="Data" />
        <SectionCard>
          <div style={{ padding: '14px 0' }}>
            <button
              onClick={handleClearData}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Clear all local data
            </button>
            <p style={{ color: '#5a5d70', fontSize: '11px', marginTop: '8px' }}>
              Removes all watched windows, task cards, and notification history. Settings and rules are preserved.
            </p>
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
