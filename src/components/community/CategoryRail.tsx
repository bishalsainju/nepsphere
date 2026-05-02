import Link from 'next/link'

const CATEGORIES = [
  { id: 'all',          label: 'All posts' },
  { id: 'VISA',         label: 'Visa' },
  { id: 'JOBS',         label: 'Jobs' },
  { id: 'LIFE_ABROAD',  label: 'Life abroad' },
  { id: 'STUDENT',      label: 'Student' },
  { id: 'FOOD_CULTURE', label: 'Food & culture' },
  { id: 'GENERAL',      label: 'General' },
]

export function CategoryRail({
  activeCategory,
  city,
  country,
  state,
}: {
  activeCategory: string
  city: string
  country?: string | null
  state?: string | null
}) {
  function geoParams(extra?: Record<string, string>) {
    const p = new URLSearchParams()
    if (country) p.set('country', country)
    if (state)   p.set('state', state)
    if (city)    p.set('city', city)
    if (extra)   Object.entries(extra).forEach(([k, v]) => p.set(k, v))
    return p.toString() ? `?${p.toString()}` : ''
  }

  return (
    <aside className="np-side">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '0 0 6px', padding: '0 12px' }}>
          Categories
        </h4>
        {CATEGORIES.map(c => (
          <Link
            key={c.id}
            href={`/community${geoParams({ category: c.id })}`}
            className={`np-side-link ${activeCategory === c.id ? 'active' : ''}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '0 0 6px', padding: '0 12px' }}>
          Groups
        </h4>
        <Link href={`/community/groups${geoParams()}`} className="np-side-link">
          Browse all groups →
        </Link>
        <Link href="/community/groups/new" className="np-side-link">
          + Create a group
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '0 0 4px', padding: '0 12px' }}>
          Trending
        </h4>
        {['H1B FY26 selection notices', 'Dashain meet-up at Klyde Warren', 'SEVIS transfer Dallas → Austin'].map(t => (
          <div key={t} style={{ padding: '6px 12px', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.4, cursor: 'pointer' }}>
            {t}
          </div>
        ))}
      </div>
    </aside>
  )
}
