'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const COUNTRIES = ['USA', 'Canada', 'Australia', 'UK', 'Nepal', 'India', 'UAE']
const CITIES = ['Dallas', 'Houston', 'Austin', 'New York', 'San Jose', 'Toronto', 'Vancouver', 'Sydney', 'London', 'Dubai', 'Kathmandu']

export function SettingsClient({ user }: { user: any }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name:    user.name    ?? '',
    bio:     user.bio     ?? '',
    city:    user.city    ?? '',
    state:   user.state   ?? '',
    country: user.country ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save')
        return
      }
      setSaved(true)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="np-subpage-sm">
      <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to profile
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', marginBottom: 6 }}>
        Settings
      </h1>
      <p style={{ color: 'var(--fg-3)', fontSize: 14, marginBottom: 24 }}>
        {user.email}
        {user.isVerified && <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: 9999 }}>Verified</span>}
        {user.isAdmin    && <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 700, background: '#EDE9FE', color: '#5B21B6', padding: '2px 8px', borderRadius: 9999 }}>Admin</span>}
      </p>

      <div className="np-card np-card-body">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Display name</label>
            <input className="np-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Bio</label>
            <textarea
              className="np-input"
              rows={3}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              placeholder="A short bio about yourself…"
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div className="np-form-2col">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Country</label>
              <select className="np-input" value={form.country} onChange={e => set('country', e.target.value)}>
                <option value="">— select —</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>State / Province</label>
              <input className="np-input" value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Texas" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City</label>
            <select className="np-input" value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">— select —</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {error && <p style={{ color: 'var(--crimson-500)', fontSize: 14, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button type="submit" className="np-btn np-btn-primary" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Save size={15} strokeWidth={1.8} />
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saved && <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Saved!</span>}
          </div>
        </form>
      </div>

      <div className="np-card np-card-body" style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginBottom: 4 }}>Account info</div>
        <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.7 }}>
          <div>Email: <span style={{ color: 'var(--fg-1)' }}>{user.email}</span></div>
          <div>Member since: <span style={{ color: 'var(--fg-1)' }}>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
        </div>
      </div>
    </div>
  )
}
