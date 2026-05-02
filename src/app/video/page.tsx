'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Plus, X, PlayCircle } from 'lucide-react'

const CATEGORIES = ['Visa', 'Jobs', 'Finance', 'Housing', 'Student', 'Health', 'Culture', 'Other']

const CAT_COLORS: Record<string, string> = {
  Visa: '#0EA5E9', Jobs: '#059669', Finance: '#F59E0B', Housing: '#EA580C',
  Student: '#8B5CF6', Health: '#EC4899', Culture: '#E11D48', Other: '#6B7280',
}

function parseVideoEmbed(url: string): { embedUrl: string; thumb: string } | null {
  try {
    const u = new URL(url)
    // YouTube watch
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      const id = u.searchParams.get('v')!
      return {
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }
    }
    // YouTube short link
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1)
      return {
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return {
        embedUrl: `https://player.vimeo.com/video/${id}`,
        thumb: '',
      }
    }
  } catch {}
  return null
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

function VideoCard({ video }: { video: any }) {
  const [playing, setPlaying] = useState(false)
  const parsed = parseVideoEmbed(video.url)
  const color = video.category ? CAT_COLORS[video.category] : '#6B7280'

  return (
    <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Thumbnail / embed */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#111', cursor: parsed ? 'pointer' : 'default' }}
        onClick={() => parsed && setPlaying(true)}>
        {playing && parsed ? (
          <iframe src={parsed.embedUrl + '?autoplay=1'} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay" />
        ) : parsed?.thumb ? (
          <>
            <img src={parsed.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                <PlayCircle size={32} color="white" strokeWidth={1.5} />
              </div>
            </div>
          </>
        ) : parsed ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayCircle size={32} color="white" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Click to play</span>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}>Open video link</a>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.3 }}>{video.title}</div>
          {video.category && (
            <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, background: color + '18', color, padding: '2px 9px', borderRadius: 9999 }}>
              {video.category}
            </span>
          )}
        </div>
        {video.description && (
          <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '0 0 8px', lineHeight: 1.5 }}>{video.description}</p>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--fg-4)' }}>
          {video.author.image
            ? <img src={video.author.image} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
            : <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 9, fontWeight: 700 }}>{(video.author.name ?? '?')[0]}</div>}
          <span>{video.author.name ?? 'Anonymous'}</span>
          <span>·</span>
          <span>{timeAgo(video.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default function VideosPage() {
  const { data: session } = useSession()
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', url: '', category: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/videos' + (filter ? `?category=${filter}` : ''))
      .then(r => r.json()).then(setVideos).finally(() => setLoading(false))
  }, [filter])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setVideos(prev => [data, ...prev])
    setForm({ title: '', description: '', url: '', category: '' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: 0 }}>
            Videos
          </h1>
          <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '4px 0 0' }}>
            Tutorials, experiences, and community clips
          </p>
        </div>
        {session && (
          <button
            onClick={() => setShowForm(v => !v)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9999, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={16} strokeWidth={2.5} /> Share a video
          </button>
        )}
      </div>

      {/* Add video form */}
      {showForm && (
        <div className="np-card" style={{ marginBottom: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, margin: 0 }}>Share a video</h2>
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
              placeholder="YouTube or Vimeo URL" required
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
              {saving ? 'Sharing…' : 'Share video'}
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

      {/* Video grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--fg-4)' }}>Loading…</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--fg-3)' }}>
          <PlayCircle size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <div style={{ fontSize: 15 }}>No videos yet. Be the first to share one!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}

      {!session && (
        <div style={{ marginTop: 32, textAlign: 'center', padding: '24px', background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Want to share a video? </span>
          <Link href="/signin?callbackUrl=/video" style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      )}
    </div>
  )
}
