import Link from 'next/link'

export function GroupCard({
  group,
}: {
  group: {
    id: string
    name: string
    slug: string
    description: string
    emoji: string | null
    city: string
    membersCount: number
    _count: { members: number }
  }
}) {
  const members = group._count.members || group.membersCount

  return (
    <Link href={`/community/groups/${group.slug}`} style={{ textDecoration: 'none' }}>
      <article className="np-card interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{ fontSize: 40 }}>{group.emoji ?? '🇳🇵'}</div>
        <div>
          <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg-1)' }}>
            {group.name}
          </h3>
          <div className="np-meta">{group.city} · {members} members</div>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.55, flex: 1 }}>
          {group.description}
        </p>
        <button className="np-btn np-btn-secondary sm" style={{ alignSelf: 'flex-start' }}>
          Join group
        </button>
      </article>
    </Link>
  )
}
