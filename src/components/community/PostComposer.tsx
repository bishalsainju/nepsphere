'use client'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Plus } from 'lucide-react'

const CATEGORIES = ['VISA', 'JOBS', 'LIFE_ABROAD', 'STUDENT', 'FOOD_CULTURE', 'GENERAL']
const CATEGORY_LABELS: Record<string, string> = {
  VISA: 'Visa', JOBS: 'Jobs', LIFE_ABROAD: 'Life abroad',
  STUDENT: 'Student', FOOD_CULTURE: 'Food & culture', GENERAL: 'General',
}

export function PostComposer({ city }: { city: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [loading, setLoading] = useState(false)

  async function handlePost() {
    if (!title.trim()) return
    setLoading(true)
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, category, city }),
      })
      setTitle(''); setBody(''); setOpen(false)
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <div className="np-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name="You" size={36} />
        <div
          onClick={() => setOpen(true)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--fg-4)', cursor: 'text', fontSize: 14 }}
        >
          Ask your community a question…
        </div>
        <button className="np-btn np-btn-primary sm" onClick={() => setOpen(true)}>
          <Plus size={14} strokeWidth={2} /> New post
        </button>
      </div>
    )
  }

  return (
    <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        className="np-input"
        placeholder="Title — what do you need help with?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ fontSize: 17, fontWeight: 600 }}
      />
      <textarea
        className="np-input"
        rows={4}
        placeholder="Add details, context, what you've already tried…"
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ resize: 'vertical', fontFamily: 'inherit' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <select
          className="np-input"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: 'auto', flex: 'none', fontSize: 13 }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
        <span className="np-meta" style={{ fontSize: 12 }}>
          in <strong style={{ color: 'var(--fg-1)' }}>{city}</strong>
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="np-btn np-btn-secondary sm" onClick={() => setOpen(false)}>Cancel</button>
          <button
            className="np-btn np-btn-primary sm"
            disabled={!title.trim() || loading}
            onClick={handlePost}
          >
            {loading ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
