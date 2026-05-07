'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Plus, Bell, X, CheckCircle } from 'lucide-react'

export function RoomsRightRail({ city }: { city: string }) {
  const [showAlert, setShowAlert] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleAlert(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <aside className="np-side">
      {showAlert && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowAlert(false); setSubmitted(false) } }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%', position: 'relative' }}>
            <button onClick={() => { setShowAlert(false); setSubmitted(false) }} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}>
              <X size={18} />
            </button>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--fg-1)' }}>
              <Bell size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--primary)' }} />
              Set a room alert
            </h3>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={40} style={{ color: '#059669', marginBottom: 12 }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: '#059669', margin: 0 }}>Alert set! We'll email you when new rooms in {city} become available.</p>
              </div>
            ) : (
              <>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)' }}>
                  Get notified when new rooms in <strong>{city}</strong> match your filters.
                </p>
                <form onSubmit={handleAlert} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="email"
                    className="np-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="np-btn np-btn-primary" style={{ justifyContent: 'center' }}>
                    <Bell size={14} strokeWidth={1.5} /> Create alert
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Have a room?
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          List it free. Verified hosts get a badge and 3× more replies.
        </p>
        <Link href="/rooms/new" className="np-btn np-btn-primary">
          <Plus size={14} strokeWidth={2} /> Post a room
        </Link>
      </div>

      <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Set an alert
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          Email me when new rooms in {city} match my filters.
        </p>
        <button onClick={() => setShowAlert(true)} className="np-btn np-btn-secondary sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Bell size={13} strokeWidth={1.5} /> Create alert
        </button>
      </div>

      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Average rent in {city}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { type: 'Private room', price: '$750' },
            { type: 'Shared room', price: '$500' },
            { type: 'Studio', price: '$1,100' },
            { type: 'Entire apt', price: '$1,400' },
          ].map(r => (
            <div key={r.type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--fg-2)' }}>{r.type}</span>
              <span style={{ fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{r.price}/mo</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
