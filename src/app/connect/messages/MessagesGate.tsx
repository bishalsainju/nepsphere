'use client'
import { useState } from 'react'
import { Zap, Lock } from 'lucide-react'
import { UpgradeModal } from '@/components/connect/UpgradeModal'

export function MessagesGate({ isPremium }: { isPremium: boolean }) {
  const [showModal, setShowModal] = useState(false)

  if (isPremium) {
    return (
      <div className="np-card np-empty">
        <h3>No messages yet.</h3>
        <p style={{ fontSize: 14, marginTop: 4 }}>When you match with someone, you can message them here.</p>
      </div>
    )
  }

  return (
    <>
      {showModal && <UpgradeModal reason="message" onClose={() => setShowModal(false)} />}
      <div className="np-card" style={{ textAlign: 'center', padding: '48px 28px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Lock size={24} style={{ color: 'white' }} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: '0 0 10px', color: 'var(--fg-1)' }}>
          Messaging is a Premium feature
        </h3>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 28px', lineHeight: 1.65, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
          Upgrade to Premium to send and receive messages from your matches.
        </p>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 32px', borderRadius: 9999, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
            color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
            boxShadow: '0 4px 20px rgba(227,28,95,0.35)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          <Zap size={16} /> Upgrade to Premium
        </button>
      </div>
    </>
  )
}
