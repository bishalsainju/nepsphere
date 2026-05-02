import Link from 'next/link'

export function CommunityRightRail({ city }: { city: string }) {
  return (
    <aside className="np-side">
      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Welcome to {city}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          1,284 verified Nepalis call this city home. Be kind. Stay practical.
        </p>
        <button
          className="np-btn np-btn-ghost sm"
          style={{ marginTop: 10, padding: '6px 0' }}
        >
          Community guidelines →
        </button>
      </div>

      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          This week
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { title: 'Dashain dinner', meta: 'Sat · Klyde Warren Park', color: 'var(--crimson-500)' },
            { title: 'F1 students mixer', meta: 'Sun · UTD campus', color: 'var(--saffron-500)' },
            { title: 'Momos & chai night', meta: 'Fri · Irving Community Center', color: 'var(--emerald-500)' },
          ].map(ev => (
            <div key={ev.title} style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
              <div style={{ width: 4, background: ev.color, borderRadius: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{ev.title}</div>
                <div className="np-meta" style={{ fontSize: 12 }}>{ev.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="np-card" style={{ padding: 18 }}>
        <h4 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Popular groups
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { emoji: '🎓', name: 'F1 Students Dallas', members: 412 },
            { emoji: '🍜', name: 'Foodies DFW', members: 287 },
            { emoji: '🌸', name: 'Aamaa Group DFW', members: 193 },
          ].map(g => (
            <Link key={g.name} href={`/community/groups`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '6px 0' }}>
              <span style={{ fontSize: 20 }}>{g.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{g.name}</div>
                <div className="np-meta" style={{ fontSize: 12 }}>{g.members} members</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/community/groups" style={{ display: 'block', marginTop: 10, fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Browse all groups →
        </Link>
      </div>
    </aside>
  )
}
