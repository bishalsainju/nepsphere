'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { COUNTRIES, getStatesForCountry, getCitiesForState } from '@/lib/geo'

const EMOJIS = ['💬', '🎓', '🏠', '💼', '🍜', '🌸', '🇳🇵', '🤝', '🎉', '📚', '🎵', '⚽', '🧘', '👨‍👩‍👧', '💻', '🌿', '🙏', '🎭']

export default function NewGroupPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    emoji: '💬',
    country: 'USA',
    state: 'Texas',
    city: 'Dallas',
    isPrivate: false,
  })

  function set(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  const slug = form.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create group')
      }
      const group = await res.json()
      router.push(`/community/groups/${group.slug}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const valid = form.name.trim().length >= 3 && form.description.trim().length >= 10

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Link href="/community/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 24 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Groups
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)', marginBottom: 6 }}>
        Create a group
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 28, fontSize: 15 }}>
        Bring your community together around a shared interest or identity.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Emoji picker */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Group emoji</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMOJIS.map(em => (
              <button
                key={em}
                type="button"
                onClick={() => set('emoji', em)}
                style={{
                  width: 42, height: 42, borderRadius: 10, fontSize: 22,
                  border: `2px solid ${form.emoji === em ? 'var(--primary)' : 'var(--border)'}`,
                  background: form.emoji === em ? 'var(--primary-50, #EFF6FF)' : 'var(--surface)',
                  cursor: 'pointer',
                }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Group name *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Nepali Doctors DFW"
            maxLength={60}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
          />
          {slug && (
            <div style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 4 }}>URL: /community/groups/{slug}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Description *</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            placeholder="What's this group about? Who should join?"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', background: 'var(--surface)', color: 'var(--fg-1)' }}
          />
        </div>

        {/* Country */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Country</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COUNTRIES.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  const firstState = getStatesForCountry(c.name)[0]
                  const firstCity  = firstState ? getCitiesForState(c.name, firstState.stateName)[0] : null
                  set('country', c.name)
                  set('state',   firstState?.stateName ?? '')
                  set('city',    firstCity?.city ?? '')
                }}
                style={{
                  padding: '9px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  border: `2px solid ${form.country === c.name ? 'var(--primary)' : 'var(--border)'}`,
                  background: form.country === c.name ? 'var(--primary-50, #EFF6FF)' : 'var(--surface)',
                  cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-1)',
                }}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* State */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>State / Province</label>
          <select
            value={form.state}
            onChange={e => {
              const firstCity = getCitiesForState(form.country, e.target.value)[0]
              set('state', e.target.value)
              set('city',  firstCity?.city ?? '')
            }}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
          >
            {getStatesForCountry(form.country).map(s => (
              <option key={s.stateName} value={s.stateName}>{s.stateName}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>City (optional)</label>
          <select
            value={form.city}
            onChange={e => set('city', e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
          >
            <option value="">— Entire {form.state} —</option>
            {getCitiesForState(form.country, form.state).map(c => (
              <option key={c.city} value={c.city}>{c.city}</option>
            ))}
          </select>
        </div>

        {/* Private toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div
            onClick={() => set('isPrivate', !form.isPrivate)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: form.isPrivate ? 'var(--primary)' : 'var(--border)',
              position: 'relative', transition: 'background 200ms', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: form.isPrivate ? 22 : 2,
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              transition: 'left 200ms', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>Private group</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Members must be approved to join</div>
          </div>
        </label>

        {error && <p style={{ color: '#DC2626', fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={!valid || saving}
          className="np-btn np-btn-primary lg"
          style={{ opacity: (!valid || saving) ? 0.5 : 1 }}
        >
          {saving ? 'Creating…' : 'Create group'}
        </button>
      </form>
    </div>
  )
}
