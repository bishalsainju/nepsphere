import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT:  'Contract',
  GIG:       'Gig',
  INTERNSHIP:'Internship',
}

function companyInitials(name: string) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const LOGO_COLORS = ['#059669', '#EA580C', '#DC2626', '#3B82F6', '#7C3AED', '#0891B2']
function logoColor(company: string) {
  const idx = company.charCodeAt(0) % LOGO_COLORS.length
  return LOGO_COLORS[idx]
}

function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function JobCard({
  job,
}: {
  job: {
    id: string
    title: string
    company: string
    description: string
    type: string
    location: string
    city: string
    salary: string | null
    sponsorship: boolean
    createdAt: Date | string
    postedBy: { id: string; name: string | null }
  }
}) {
  const preview = job.description.length > 180 ? job.description.slice(0, 180) + '…' : job.description

  return (
    <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
    <article className="np-card interactive" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 10,
          background: logoColor(job.company),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: 'white', fontSize: 14,
          flexShrink: 0, fontFamily: 'var(--font-display)',
        }}>
          {companyInitials(job.company)}
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 2 }}>{job.title}</div>
          <div className="np-meta" style={{ marginBottom: 6 }}>{job.company} · {job.location}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="np-pill" style={{ fontSize: 11 }}>{TYPE_LABELS[job.type] ?? job.type}</span>
            {job.sponsorship && <span className="np-pill success" style={{ fontSize: 11 }}>Visa sponsorship</span>}
          </div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{preview}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)', flexWrap: 'wrap' }}>
        {job.salary && (
          <span style={{ fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
            {job.salary}
          </span>
        )}
        {job.salary && <span>·</span>}
        <span>{timeAgo(job.createdAt)}</span>
        <span className="np-btn np-btn-primary sm" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Apply <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>
    </article>
    </Link>
  )
}
