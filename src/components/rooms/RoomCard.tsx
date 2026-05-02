'use client'
import Link from 'next/link'
import { Star, CheckCircle } from 'lucide-react'

const ROOM_GRADIENTS = [
  'linear-gradient(135deg, #FED7AA, #FB923C)',
  'linear-gradient(135deg, #BFDBFE, #3B82F6)',
  'linear-gradient(135deg, #D1FAE5, #059669)',
  'linear-gradient(135deg, #FEF3C7, #F59E0B)',
]

function gradientForId(id: string) {
  const sum = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return ROOM_GRADIENTS[sum % ROOM_GRADIENTS.length]
}

const TYPE_LABELS: Record<string, string> = {
  PRIVATE: 'Private room',
  SHARED: 'Shared room',
  STUDIO: 'Studio',
  ENTIRE_APT: 'Entire apartment',
}

const GENDER_LABELS: Record<string, string> = {
  ANY: 'Any gender',
  FEMALE: 'Female only',
  MALE: 'Male only',
  MIXED: 'Mixed',
}

export function RoomCard({
  room,
}: {
  room: {
    id: string
    title: string
    price: number
    type: string
    genderPref: string
    city: string
    state: string
    area: string | null
    availableFrom: Date | string
    photos: string[]
    isVerifiedHost: boolean
    isFeatured: boolean
    host: { id: string; name: string | null; isVerified: boolean }
  }
}) {
  const availDate = new Date(room.availableFrom)
  const availStr = availDate <= new Date()
    ? 'Now'
    : availDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <Link href={`/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
      <article
        className="np-card interactive"
        style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '220px 1fr' }}
      >
        {/* Photo / gradient thumbnail */}
        <div style={{ background: gradientForId(room.id), position: 'relative', minHeight: 140 }}>
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 9999 }}>
            {room.photos.length > 0 ? `${room.photos.length} photos` : 'No photos'}
          </div>
          {room.isFeatured && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'var(--saffron-100)', color: 'var(--saffron-700)', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={11} strokeWidth={2} /> Featured
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
              {room.title}
            </h3>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontSize: 18, fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0 }}>
              ${room.price.toLocaleString()}<span style={{ fontSize: 12, color: 'var(--fg-3)', fontWeight: 500 }}>/mo</span>
            </div>
          </div>

          <div className="np-meta">
            {room.area ? `${room.area} · ` : ''}{room.city}, {room.state} · Available {availStr}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="np-pill">{TYPE_LABELS[room.type] ?? room.type}</span>
            <span className="np-pill">{GENDER_LABELS[room.genderPref] ?? room.genderPref}</span>
            {room.isVerifiedHost && (
              <span className="np-pill success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={11} strokeWidth={2} /> Verified host
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
            <button className="np-btn np-btn-primary sm" onClick={e => e.preventDefault()}>
              Contact host
            </button>
            <button className="np-btn np-btn-secondary sm" onClick={e => e.preventDefault()}>
              Save
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}
