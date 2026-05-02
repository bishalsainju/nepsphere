import { CategoryRail } from '@/components/community/CategoryRail'
import { PostComposer } from '@/components/community/PostComposer'
import { PostCard } from '@/components/community/PostCard'
import { CommunityRightRail } from '@/components/community/CommunityRightRail'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere, getLocationLabel } from '@/lib/geo'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; country?: string; state?: string; city?: string }>
}) {
  const params   = await searchParams
  const country  = params.country
  const state    = params.state
  const city     = params.city
  const category = params.category

  const geoWhere = buildGeoWhere(country, state, city)
  const geoLabel = getLocationLabel(country, state, city)

  let posts: any[] = []
  try {
    posts = await prisma.post.findMany({
      where: {
        ...geoWhere,
        ...(category && category !== 'all' ? { category: category as any } : {}),
      },
      include: {
        author: { select: { id: true, name: true, image: true, isVerified: true, city: true } },
        _count: { select: { replies: true } },
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    })
  } catch {
    // DB not connected in dev — show empty state
  }

  return (
    <div className="np-page-wrap np-3col">
      <div className="np-hide-mobile">
        <CategoryRail activeCategory={category ?? 'all'} city={city ?? ''} country={country} state={state} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--fg-1)' }}>
            Community · {geoLabel}
          </h1>
          <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{posts.length} posts</span>
        </div>

        <PostComposer city={city ?? 'Dallas'} />

        {posts.length === 0 ? (
          <div className="np-card np-empty">
            <h3>No posts for {geoLabel} yet.</h3>
            <p style={{ fontSize: 14, marginTop: 4 }}>Be the first to ask.</p>
          </div>
        ) : (
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      <div className="np-hide-mobile">
        <CommunityRightRail city={city ?? 'Dallas'} />
      </div>
    </div>
  )
}
