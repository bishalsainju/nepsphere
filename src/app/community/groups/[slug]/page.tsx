import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let group: any = null
  try {
    group = await prisma.communityGroup.findUnique({
      where: { slug },
      include: {
        posts: { orderBy: { createdAt: 'desc' }, take: 20 },
        _count: { select: { members: true } },
      },
    })
  } catch {
    // DB not connected
  }

  if (!group) notFound()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Link href="/community/groups" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Groups
      </Link>

      {/* Group header */}
      <div className="np-card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{group.emoji ?? '🇳🇵'}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, margin: '0 0 6px', color: 'var(--fg-1)' }}>
          {group.name}
        </h1>
        <p style={{ color: 'var(--fg-3)', margin: '0 0 20px', fontSize: 15 }}>{group.description}</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="np-btn np-btn-primary">
            Join group
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)' }}>
            <Users size={14} strokeWidth={1.5} />
            {group._count.members} members
          </span>
          <span className="np-pill">{group.city}</span>
        </div>
      </div>

      {/* Posts */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg-1)', marginBottom: 16 }}>
        Discussions
      </h2>
      {group.posts.length === 0 ? (
        <div className="np-card np-empty">
          <h3>No posts yet.</h3>
          <p>Be the first to start a conversation in this group.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {group.posts.map((post: any) => (
            <div key={post.id} className="np-card interactive" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>
                {post.title}
              </h3>
              <p style={{ color: 'var(--fg-2)', margin: 0, fontSize: 14, lineHeight: 1.55 }}>
                {post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
