import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { PostThread } from '@/components/community/PostThread'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  VISA: 'Visa', JOBS: 'Jobs', LIFE_ABROAD: 'Life abroad',
  STUDENT: 'Student', FOOD_CULTURE: 'Food & culture', GENERAL: 'General',
}

function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true, image: true, isVerified: true } },
        replies: {
        include: { author: { select: { id: true, name: true, image: true, isVerified: true } } },
        orderBy: { createdAt: 'asc' },
      },
      },
    })
  } catch {
    // DB not connected
  }

  if (!post) notFound()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Community
      </Link>

      <article className="np-card" style={{ padding: 28, marginBottom: 24 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Avatar name={post.author.name ?? 'NS'} size={44} src={post.author.image ?? undefined} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
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
        </header>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: '0 0 16px', lineHeight: 1.3 }}>
          {post.title}
        </h1>
        <div style={{ fontSize: 16, color: 'var(--fg-2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {post.body}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--fg-3)' }}>
          <span>{post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
          <span>{post.likes} likes</span>
        </div>
      </article>

      <PostThread post={post} />
    </div>
  )
}
