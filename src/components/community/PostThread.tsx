'use client'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function PostThread({
  post,
}: {
  post: {
    id: string
    title: string
    body: string
    category: string
    city: string
    createdAt: Date | string
    likes: number
    author: { id: string; name: string | null; image: string | null; isVerified: boolean }
    replies: Array<{
      id: string
      body: string
      authorId: string
      author: { id: string; name: string | null; image: string | null; isVerified: boolean } | null
      createdAt: Date | string
    }>
  }
}) {
  const [replyBody, setReplyBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleReply() {
    if (!replyBody.trim()) return
    setSubmitting(true)
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody }),
      })
      setReplyBody('')
      window.location.reload()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Reply composer */}
      <div className="np-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar name="You" size={36} />
          <textarea
            className="np-input"
            rows={3}
            placeholder="Write a reply…"
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            className="np-btn np-btn-primary sm"
            disabled={!replyBody.trim() || submitting}
            onClick={handleReply}
          >
            {submitting ? 'Posting…' : 'Reply'}
          </button>
        </div>
      </div>

      {/* Replies */}
      {post.replies.map(reply => {
        const authorName = reply.author?.name ?? 'Community member'
        return (
          <div key={reply.id} className="np-card" style={{ padding: 16, display: 'flex', gap: 12 }}>
            <Avatar name={authorName} size={32} src={reply.author?.image ?? undefined} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                {authorName}
                {reply.author?.isVerified && <Badge size={12} />}
                <span className="np-meta" style={{ fontWeight: 400 }}>{timeAgo(reply.createdAt)}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>{reply.body}</p>
            </div>
          </div>
        )
      })}

      {post.replies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-3)', fontSize: 14 }}>
          No replies yet. Be the first to help.
        </div>
      )}
    </div>
  )
}
