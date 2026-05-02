import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  CONTRACT: 'Contract', GIG: 'Gig', INTERNSHIP: 'Internship',
}

function companyInitials(name: string) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const LOGO_COLORS = ['#059669', '#EA580C', '#DC2626', '#3B82F6', '#7C3AED', '#0891B2']
function logoColor(company: string) {
  return LOGO_COLORS[company.charCodeAt(0) % LOGO_COLORS.length]
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params

  let job: any = null
  try {
    job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { postedBy: { select: { id: true, name: true } } },
    })
  } catch {
    // DB not connected
  }

  if (!job) notFound()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Jobs
      </Link>

      <div className="np-card" style={{ padding: 28 }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 14,
            background: logoColor(job.company),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: 'white', fontSize: 18,
            flexShrink: 0, fontFamily: 'var(--font-display)',
          }}>
            {companyInitials(job.company)}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: '0 0 4px' }}>
              {job.title}
            </h1>
            <div className="np-meta">{job.company} · {job.location}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            {job.sponsorship && <span className="np-pill success">Visa sponsorship available</span>}
            <span className="np-pill">{TYPE_LABELS[job.type] ?? job.type}</span>
          </div>
        </div>

        {job.salary && (
          <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
            {job.salary}
          </div>
        )}

        <div style={{ lineHeight: 1.75, color: 'var(--fg-2)', fontSize: 15, whiteSpace: 'pre-wrap', marginBottom: 24 }}>
          {job.description}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <button className="np-btn np-btn-primary lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Apply now <ArrowRight size={16} strokeWidth={2} />
          </button>
          <button className="np-btn np-btn-secondary">
            Save job
          </button>
        </div>

        {job.postedBy && (
          <p style={{ fontSize: 13, color: 'var(--fg-4)', marginTop: 16, marginBottom: 0 }}>
            Posted by {job.postedBy.name ?? 'a community member'}
          </p>
        )}
      </div>
    </div>
  )
}
