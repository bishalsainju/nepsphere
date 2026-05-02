'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export function JobsRail({ city, state, country }: { city: string; state?: string | null; country?: string | null }) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    sponsorship: false,
    remote: false,
    contract: false,
  })

  function toggle(k: keyof typeof filters) {
    const next = { ...filters, [k]: !filters[k] }
    setFilters(next)
    const params = new URLSearchParams()
    if (country) params.set('country', country)
    if (state)   params.set('state', state)
    if (city)    params.set('city', city)
    if (next.sponsorship) params.set('sponsorship', 'true')
    router.push(`/jobs?${params}`)
  }

  return (
    <aside className="np-side">
      <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h4 style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
          Filters
        </h4>
        {([
          ['sponsorship', 'Visa sponsorship available'],
          ['remote',      'Remote OK'],
          ['contract',    'Contract / gig'],
        ] as [keyof typeof filters, string][]).map(([k, label]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--fg-2)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters[k]}
              onChange={() => toggle(k)}
              style={{ accentColor: 'var(--primary-600)', width: 15, height: 15 }}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="np-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--fg-1)' }}>
          Hiring?
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          Post a role for free. Sponsorship-available roles get a badge.
        </p>
        <Link href="/jobs/new" className="np-btn np-btn-primary sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus size={13} strokeWidth={2} /> Post a job
        </Link>
      </div>
    </aside>
  )
}
