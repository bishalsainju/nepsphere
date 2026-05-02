'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Plus, X, Presentation, ChevronDown } from 'lucide-react'

const CATEGORIES = ['Visa', 'Jobs', 'Finance', 'Housing', 'Student', 'Health', 'Culture', 'Other']

const CAT_COLORS: Record<string, string> = {
  Visa: '#0EA5E9', Jobs: '#059669', Finance: '#F59E0B', Housing: '#EA580C',
  Student: '#8B5CF6', Health: '#EC4899', Culture: '#E11D48', Other: '#6B7280',
}

function deckEmbedUrl(url: string): string {
  // Google Slides: convert /edit or /pub to /embed
  if (url.includes('docs.google.com/presentation')) {
    return url.replace(/\/(edit|pub|view).*$/, '/embed')
  }
  // SlideShare: use oembed approach — just return as-is, user should paste embed src
  return url
}

function timeAgo(date: string) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function DecksPage() {
  const { data: session } = useSession()
  const [decks, setDecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', url: '', category: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/decks' + (filter ? `?category=${filter}` : ''))
      .then(r => r.json()).then(setDecks).finally(() => setLoading(false))
  }, [filter])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setDecks(prev => [data, ...prev])
    setForm({ title: '', description: '', url: '', category: '' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: 0 }}>
            Slide Decks
          </h1>
          <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '4px 0 0' }}>
            Presentations shared by the Nepali community
          </p>
        </div>
        {session && (
          <button
            onClick={() => setShowForm(v => !v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9999, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={16} strokeWidth={2.5} /> Share a deck
          </button>
        )}
      </div>

      {/* Add deck form */}
      {showForm && (
        <div className="np-card" style={{ marginBottom: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, margin: 0 }}>Share a slide deck</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}><X size={18} /></button>
          </div>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Title" required
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontFamily: 'inherit', color: 'var(--fg-1)', outline: 'none' }}
            />
            <input
              value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="Google Slides URL (https://docs.google.com/presentation/d/…)" required
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontFamily: 'inherit', color: 'var(--fg-1)', outline: 'none' }}
            />
            <textarea
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={2}
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontFamily: 'inherit', color: 'var(--fg-1)', outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(f => ({ ...f, category: f.category === c ? '' : c }))}
                  style={{ padding: '5px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${form.category === c ? CAT_COLORS[c] : 'var(--border)'}`, background: form.category === c ? CAT_COLORS[c] + '15' : 'transparent', color: form.category === c ? CAT_COLORS[c] : 'var(--fg-3)' }}
                >
                  {c}
                </button>
              ))}
            </div>
            {error && <div style={{ fontSize: 13, color: '#DC2626' }}>{error}</div>}
            <button type="submit" disabled={saving}
              style={{ alignSelf: 'flex-end', padding: '9px 22px', borderRadius: 9999, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Sharing…' : 'Share deck'}
            </button>
          </form>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={() => setFilter('')} style={{ padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${filter === '' ? 'var(--primary)' : 'var(--border)'}`, background: filter === '' ? 'var(--primary)' : 'transparent', color: filter === '' ? 'white' : 'var(--fg-3)' }}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(filter === c ? '' : c)}
            style={{ padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${filter === c ? CAT_COLORS[c] : 'var(--border)'}`, background: filter === c ? CAT_COLORS[c] + '15' : 'transparent', color: filter === c ? CAT_COLORS[c] : 'var(--fg-3)' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Deck list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--fg-4)' }}>Loading…</div>
      ) : decks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--fg-3)' }}>
          <Presentation size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <div style={{ fontSize: 15 }}>No decks yet. Be the first to share one!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {decks.map(deck => (
            <div key={deck.id} className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: deck.category ? CAT_COLORS[deck.category] + '20' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Presentation size={20} color={deck.category ? CAT_COLORS[deck.category] : 'var(--fg-4)'} strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', lineHeight: 1.3 }}>{deck.title}</div>
                    {deck.category && (
                      <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, background: CAT_COLORS[deck.category] + '18', color: CAT_COLORS[deck.category], padding: '2px 9px', borderRadius: 9999 }}>
                        {deck.category}
                      </span>
                    )}
                  </div>
                  {deck.description && (
                    <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '4px 0 0', lineHeight: 1.5 }}>{deck.description}</p>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, fontSize: 12, color: 'var(--fg-4)' }}>
                    {deck.author.image
                      ? <img src={deck.author.image} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
                      : <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>{(deck.author.name ?? '?')[0]}</div>}
                    <span>{deck.author.name ?? 'Anonymous'}</span>
                    <span>·</span>
                    <span>{timeAgo(deck.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Expand/collapse embed */}
              <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setExpanded(expanded === deck.id ? null : deck.id)}
                  style={{ width: '100%', padding: '10px 20px', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  {expanded === deck.id ? 'Hide presentation' : 'View presentation'}
                  <ChevronDown size={14} style={{ transform: expanded === deck.id ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
                </button>
                {expanded === deck.id && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', background: '#000', aspectRatio: '16/9' }}>
                    <iframe
                      src={deckEmbedUrl(deck.url)}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!session && (
        <div style={{ marginTop: 32, textAlign: 'center', padding: '24px', background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Want to share a presentation? </span>
          <Link href="/signin?callbackUrl=/deck" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      )}
    </div>
  )
}
