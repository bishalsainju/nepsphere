import Link from 'next/link'
import { Plus, Bell } from 'lucide-react'

export function RoomsRightRail({ city }: { city: string }) {
  return (
    <aside className="np-side">
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
        <button className="np-btn np-btn-secondary sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
