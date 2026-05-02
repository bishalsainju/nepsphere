import { ShieldCheck } from 'lucide-react'

export function VerificationBanner() {
  return (
    <div className="np-verify-banner" style={{
      marginBottom: 20,
      background: 'var(--primary-50)',
      border: '1px solid rgba(234,88,12,0.2)',
      borderRadius: 12,
    }}>
      <ShieldCheck size={20} strokeWidth={1.5} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
          Verified profiles only in Connect.
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
          Get verified to post in Connect.
        </div>
      </div>
      <button className="np-btn np-btn-primary sm np-verify-btn">
        Get verified
      </button>
    </div>
  )
}
