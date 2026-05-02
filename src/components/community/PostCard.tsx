import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { MessageCircle, Heart, Bookmark, Flag, MoreHorizontal } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  VISA:         'Visa',
  JOBS:         'Jobs',
  LIFE_ABROAD:  'Life abroad',
  STUDENT:      'Student',
  FOOD_CULTURE: 'Food & culture',
  GENERAL:      'General',
}

function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function PostCard({
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
    pinned: boolean
    author: { id: string; name: string | null; image: string | null; isVerified: boolean; city: string | null }
    _count: { replies: number }
  }
}) {
  const preview = post.body.length > 240 ? post.body.slice(0, 240) + '…' : post.body

  return (
    <article className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={post.author.name ?? 'NS'} size={36} src={post.author.image ?? undefined} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {post.author.name ?? 'Community member'}
            {post.author.isVerified && <Badge size={14} />}
          </div>
          <div className="np-meta">
            {post.city}
            <span className="np-meta-dot" />
            {timeAgo(post.createdAt)}
            <span className="np-meta-dot" />
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{CATEGORY_LABELS[post.category] ?? post.category}</span>
          </div>
        </div>
        <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--fg-4)', cursor: 'pointer', padding: 4 }}>
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </button>
      </header>

      <Link href={`/community/${post.id}`} style={{ textDecoration: 'none' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.3 }}>
          {post.pinned && <span style={{ color: 'var(--primary)', marginRight: 6 }}>📌</span>}
          {post.title}
        </h3>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.55 }}>{preview}</p>
      </Link>

      <footer className="np-post-footer">
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
          <MessageCircle size={15} strokeWidth={1.5} /> {post._count.replies} replies
        </button>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
          <Heart size={15} strokeWidth={1.5} /> {post.likes}
        </button>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
          <Bookmark size={15} strokeWidth={1.5} /> Save
        </button>
        <button style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--fg-3)', cursor: 'pointer', fontSize: 13 }}>
          <Flag size={15} strokeWidth={1.5} /> Report
        </button>
      </footer>
    </article>
  )
}
