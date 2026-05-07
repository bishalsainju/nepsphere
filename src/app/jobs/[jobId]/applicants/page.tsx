import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, FileText, Mail, BadgeCheck } from 'lucide-react'

function formatDateRange(startDate?: string | null, endDate?: string | null, current?: boolean) {
  const start = startDate?.trim() || '—'
  const end   = current ? 'Present' : (endDate?.trim() || 'Present')
  return `${start} → ${end}`
}

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const session = await getServerSession(authOptions)
  const userId  = (session?.user as any)?.id
  if (!userId) redirect(`/signin?callbackUrl=/jobs/${jobId}/applicants`)

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, title: true, company: true, postedById: true },
  })
  if (!job) notFound()
  if (job.postedById !== userId) {
    return (
      <div className="np-subpage">
        <Link href={`/jobs/${jobId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 18 }}>
          <ArrowLeft size={14} /> Back to job
        </Link>
        <div className="np-card np-card-body">
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>Not authorized</h1>
          <p style={{ marginTop: 8, color: 'var(--fg-3)' }}>Only the job poster can view applicants.</p>
        </div>
      </div>
    )
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true, name: true, image: true, email: true, isVerified: true,
          jobProfile: {
            include: {
              experiences: { orderBy: { sortOrder: 'asc' } },
              education:   { orderBy: { sortOrder: 'asc' } },
            },
          },
        },
      },
    },
  })

  return (
    <div className="np-subpage" style={{ maxWidth: 920 }}>
      <Link href={`/jobs/${jobId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 18 }}>
        <ArrowLeft size={14} /> Back to job
      </Link>

      <h1 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)' }}>
        Applicants — {job.title}
      </h1>
      <p style={{ margin: '0 0 24px', color: 'var(--fg-3)', fontSize: 14 }}>
        {job.company} · {applications.length} application{applications.length === 1 ? '' : 's'}
      </p>

      {applications.length === 0 ? (
        <div className="np-card np-empty">
          <h3>No applications yet</h3>
          <p style={{ fontSize: 14, marginTop: 4 }}>You'll see applicants here as they apply.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {applications.map(app => {
            const profile = app.user.jobProfile
            return (
              <div key={app.id} className="np-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--fg-1)' }}>
                        {app.user.name ?? 'Applicant'}
                      </h3>
                      {app.user.isVerified && <BadgeCheck size={16} style={{ color: 'var(--primary)' }} />}
                    </div>
                    {profile?.headline && (
                      <div style={{ fontSize: 14, color: 'var(--fg-2)', marginBottom: 6 }}>{profile.headline}</div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--fg-3)' }}>
                      {app.user.email && (
                        <a href={`mailto:${app.user.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--fg-3)' }}>
                          <Mail size={12} /> {app.user.email}
                        </a>
                      )}
                      {profile?.city && <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>}
                      {profile?.workAuth && <span>{profile.workAuth}</span>}
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {profile?.resumeUrl && (
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="np-btn np-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <FileText size={14} /> Resume
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="np-btn np-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        LinkedIn <ExternalLink size={12} />
                      </a>
                    )}
                    {profile?.portfolioUrl && (
                      <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="np-btn np-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        Portfolio <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {app.note && (
                  <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'var(--surface-2)', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      Cover note
                    </div>
                    {app.note}
                  </div>
                )}

                {profile?.about && (
                  <div style={{ marginTop: 14, fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {profile.about}
                  </div>
                )}

                {(profile?.skills?.length ?? 0) > 0 && (
                  <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile!.skills.map(s => (
                      <span key={s} style={{ padding: '4px 10px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}

                {(profile?.experiences?.length ?? 0) > 0 && (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Experience</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {profile!.experiences.map(e => (
                        <div key={e.id} style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>{e.role} · {e.company}</div>
                          <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                            {formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}
                          </div>
                          {e.description && <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{e.description}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(profile?.education?.length ?? 0) > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Education</div>
                    {profile!.education.map(e => (
                      <div key={e.id} style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                        <strong>{e.school}</strong>
                        {e.degree && ` · ${e.degree}`}
                        {e.field && `, ${e.field}`}
                        {(e.startYear || e.endYear) && ` (${e.startYear || ''}${e.startYear || e.endYear ? '–' : ''}${e.endYear || ''})`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
