import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import { JobActions } from './JobActions'

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
  const session = await getServerSession(authOptions)
  const viewerId = (session?.user as any)?.id as string | undefined

  let job: any = null
  let applicantCount = 0
  try {
    job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { postedBy: { select: { id: true, name: true } } },
    })
    if (job && viewerId === job.postedById) {
      applicantCount = await prisma.jobApplication.count({ where: { jobId } })
    }
  } catch {
    // DB not connected
  }

  if (!job) notFound()
  const isOwner = viewerId === job.postedById

  return (
    <div className="np-subpage">
      <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Jobs
      </Link>

      <div className="np-card np-card-body">
        {/* Header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
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

        {isOwner ? (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href={`/jobs/${jobId}/applicants`} className="np-btn np-btn-primary lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} /> View applicants ({applicantCount})
            </Link>
            <span style={{ fontSize: 13, color: 'var(--fg-4)' }}>You posted this job.</span>
          </div>
        ) : (
          <JobActions jobId={jobId} jobTitle={job.title} company={job.company} />
        )}

        {job.postedBy && (
          <p style={{ fontSize: 13, color: 'var(--fg-4)', marginTop: 16, marginBottom: 0 }}>
            Posted by {job.postedBy.name ?? 'a community member'}
          </p>
        )}
      </div>
    </div>
  )
}
