'use client'
import { Users, Heart, Gem } from 'lucide-react'

const INTENTS = [
  { id: 'FRIENDSHIP', label: 'Friendship', Icon: Users, color: '#3B82F6', desc: 'Make a chai friend.' },
  { id: 'DATING',     label: 'Dating',     Icon: Heart, color: '#E31C5F', desc: 'Meet someone real.' },
  { id: 'MARRIAGE',   label: 'Marriage',   Icon: Gem,   color: '#0E9F6E', desc: 'For something serious.' },
]

export function IntentPicker({
  onPick,
}: {
  onPick: (intent: string) => void
}) {
  return (
    <div className="np-subpage np-intent-wrap" style={{ maxWidth: 960, textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,5vw,40px)', fontWeight: 800, marginBottom: 10 }}>
        What are you looking for?
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 40, fontSize: 16 }}>
        Three intents. Never confused.
      </p>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        {INTENTS.map(i => (
          <button
            key={i.id}
            onClick={() => onPick(i.id)}
            className="np-intent-btn"
            style={{
              borderRadius: 20,
              border: '2px solid var(--border)',
              background: 'var(--surface)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 180ms ease-out',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.borderColor = i.color
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = 'var(--shadow-md)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--border)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'var(--shadow-sm)'
            }}
          >
            <i.Icon size={32} color={i.color} strokeWidth={1.5} />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{i.label}</div>
            <div style={{ fontSize: 14, color: 'var(--fg-3)' }}>{i.desc}</div>
          </button>
        ))}
      </div>

      <p style={{ marginTop: 48, fontSize: 13, color: 'var(--fg-4)' }}>
        Family-aware, intention-clear. Background sections only if you choose to share.
      </p>
    </div>
  )
}
