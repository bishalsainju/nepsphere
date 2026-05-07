import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'

const CATEGORY_LABELS: Record<string, string> = {
  VISA: 'Visa', JOBS: 'Jobs', LIFE_ABROAD: 'Life abroad',
  STUDENT: 'Student', FOOD_CULTURE: 'Food & culture', GENERAL: 'General',
}
const CATEGORY_COLORS: Record<string, string> = {
  VISA: '#0EA5E9', JOBS: '#059669', LIFE_ABROAD: '#7C3AED',
  STUDENT: '#EA580C', FOOD_CULTURE: '#E31C5F', GENERAL: '#6B7280',
}

export async function CommunityRightRail({ city }: { city: string }) {
  let trending: any[] = []
  let groups: any[]   = []

  try {
    ;[trending, groups] = await Promise.all([
      prisma.post.findMany({
        orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }],
        take: 5,
        select: { id: true, title: true, category: true, likes: true, _count: { select: { replies: true } } },
      }),
      prisma.communityGroup.findMany({
        orderBy: { membersCount: 'desc' },
        take: 3,
        select: { id: true, name: true, slug: true, emoji: true, membersCount: true },
      }),
    ])
  } catch {
    // DB unavailable
  }

  return (
    <aside className="np-side">
      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Welcome to {city}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          A trusted space for Nepalis living abroad. Be kind. Stay practical.
        </p>
        <Link
          href="/community"
          style={{ marginTop: 10, display: 'inline-block', fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
        >
          Community guidelines →
        </Link>
      </div>

      {/* Trending */}
      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <TrendingUp size={16} style={{ color: '#E31C5F' }} /> Trending
        </h4>
        {trending.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-4)' }}>No posts yet — be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trending.map((post, i) => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg-4)', minWidth: 18, lineHeight: '20px' }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.35, marginBottom: 3 }}>
                    {post.title.length > 60 ? post.title.slice(0, 60) + '…' : post.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11 }}>
                    <span style={{
                      background: (CATEGORY_COLORS[post.category] ?? '#6B7280') + '18',
                      color: CATEGORY_COLORS[post.category] ?? '#6B7280',
                      fontWeight: 700, padding: '1px 7px', borderRadius: 9999,
                    }}>
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span style={{ color: 'var(--fg-4)' }}>❤ {post.likes}</span>
                    <span style={{ color: 'var(--fg-4)' }}>· {post._count.replies} replies</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Popular groups */}
      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Popular groups
        </h4>
        {groups.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-4)' }}>No groups yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {groups.map(g => (
              <Link key={g.id} href={`/community/groups/${g.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '6px 0' }}>
                <span style={{ fontSize: 20 }}>{g.emoji ?? '👥'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{g.name}</div>
                  <div className="np-meta" style={{ fontSize: 12 }}>{g.membersCount} members</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Link href="/community/groups" style={{ display: 'block', marginTop: 10, fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Browse all groups →
        </Link>
      </div>
    </aside>
  )
}
