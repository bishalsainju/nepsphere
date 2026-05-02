'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = ['Dallas', 'Houston', 'Austin', 'New York', 'San Jose', 'Toronto', 'Vancouver', 'Sydney']
const ROOM_TYPES = [
  { value: 'PRIVATE', label: 'Private room' },
  { value: 'SHARED', label: 'Shared room' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ENTIRE_APT', label: 'Entire apartment' },
]
const GENDER_PREFS = [
  { value: 'ANY', label: 'Any gender' },
  { value: 'FEMALE', label: 'Female only' },
  { value: 'MALE', label: 'Male only' },
  { value: 'MIXED', label: 'Mixed' },
]

export function RoomForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '', price: '', type: 'PRIVATE',
    genderPref: 'ANY', city: 'Dallas', state: 'Texas', area: '', availableFrom: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseInt(form.price) }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
        return
      }
      const room = await res.json()
      router.push(`/rooms/${room.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Listing title</label>
        <input className="np-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Cozy private room in Uptown Dallas" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Monthly rent ($)</label>
          <input className="np-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="850" required min={100} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Available from</label>
          <input className="np-input" type="date" value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Room type</label>
          <select className="np-input" value={form.type} onChange={e => set('type', e.target.value)}>
            {ROOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Gender preference</label>
          <select className="np-input" value={form.genderPref} onChange={e => set('genderPref', e.target.value)}>
            {GENDER_PREFS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City</label>
          <select className="np-input" value={form.city} onChange={e => set('city', e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Neighborhood / area</label>
          <input className="np-input" value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Uptown, Plano" />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
        <textarea className="np-input" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the room, house rules, what's included…" required style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      </div>

      {error && <p style={{ color: 'var(--crimson-500)', fontSize: 14 }}>{error}</p>}

      <button type="submit" className="np-btn np-btn-primary lg" disabled={loading}>
        {loading ? 'Posting…' : 'Post listing'}
      </button>
    </form>
  )
}
