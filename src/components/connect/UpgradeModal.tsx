'use client'
import { X, Zap, MessageCircle, Heart, Infinity } from 'lucide-react'

const BENEFITS = [
  { icon: <Infinity size={16} />, text: 'Unlimited swipes every day' },
  { icon: <MessageCircle size={16} />, text: 'Message anyone you match with' },
  { icon: <Heart size={16} />, text: 'See who liked your profile' },
  { icon: <Zap size={16} />, text: 'Priority placement in search results' },
]

export function UpgradeModal({ reason, onClose }: { reason: 'swipes' | 'message'; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 24,
        padding: '32px 28px 28px',
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--fg-3)', padding: 4, borderRadius: 8,
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Zap size={26} style={{ color: 'white' }} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          color: 'var(--fg-1)', margin: '0 0 8px',
        }}>
          Upgrade to Premium
        </h2>

        <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 24px', lineHeight: 1.6 }}>
          {reason === 'swipes'
            ? "You've used all 10 of your free swipes for today. Upgrade to swipe without limits."
            : 'Messaging is a premium feature. Upgrade to start conversations with your matches.'}
        </p>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: '#FFF0F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E31C5F',
              }}>
                {b.icon}
              </div>
              <span style={{ fontSize: 14, color: 'var(--fg-2)', fontWeight: 500 }}>{b.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            width: '100%', padding: '14px',
            borderRadius: 9999, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
            color: 'white', fontWeight: 700, fontSize: 15,
            fontFamily: 'inherit',
            boxShadow: '0 4px 20px rgba(227,28,95,0.35)',
          }}
          onClick={() => {
            // TODO: wire up real payment/upgrade flow
            alert('Premium upgrade coming soon!')
          }}
        >
          Upgrade to Premium
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--fg-4)', marginTop: 12 }}>
          Resets every day at midnight UTC
        </p>
      </div>
    </div>
  )
}
