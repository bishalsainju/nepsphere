'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROOM_TYPES = ['Any', 'Private', 'Shared', 'Studio', 'Entire_apt']
const GENDER_PREFS = ['Any', 'Female', 'Male', 'Mixed']

export function RoomsFilters({ city, state, country }: { city: string; state?: string | null; country?: string | null }) {
  const router = useRouter()
  const [maxPrice, setMaxPrice] = useState(2500)
  const [minPrice, setMinPrice] = useState(300)
  const [type, setType] = useState('Any')
  const [gender, setGender] = useState('Any')
  const [verified, setVerified] = useState(false)

  function apply() {
    const params = new URLSearchParams({
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      type,
      gender,
      ...(country  ? { country }  : {}),
      ...(state    ? { state }    : {}),
      ...(city     ? { city }     : {}),
      ...(verified ? { verified: 'true' } : {}),
    })
    router.push(`/rooms?${params}`)
  }

  return (
    <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4 style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
        Filters
      </h4>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Price: ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}/mo
        </div>
        <input
          type="range"
          min="300" max="2500" step="50"
          value={maxPrice}
          onChange={e => setMaxPrice(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--primary-600)' }}
        />
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Room type</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ROOM_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                background: type === t ? 'var(--primary-600)' : 'var(--surface-2)',
                color: type === t ? 'white' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {t === 'Entire_apt' ? 'Entire apt' : t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Gender preference</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {GENDER_PREFS.map(g => (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                background: gender === g ? 'var(--primary-600)' : 'var(--surface-2)',
                color: gender === g ? 'white' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-2)', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <input
          type="checkbox"
          checked={verified}
          onChange={e => setVerified(e.target.checked)}
          style={{ accentColor: 'var(--primary-600)', width: 16, height: 16 }}
        />
        Verified hosts only
      </label>

      <button className="np-btn np-btn-primary" onClick={apply} style={{ marginTop: 4 }}>
        Apply filters
      </button>
    </div>
  )
}
