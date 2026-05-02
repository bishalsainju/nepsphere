import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/jobs/JobCard'
import { JobsRail } from '@/components/jobs/JobsRail'
import { buildGeoWhere, getLocationLabel } from '@/lib/geo'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; state?: string; city?: string; sponsorship?: string; type?: string }>
}) {
  const params   = await searchParams
  const country  = params.country
  const state    = params.state
  const city     = params.city
  const geoLabel = getLocationLabel(country, state, city)
  const geoWhere = buildGeoWhere(country, state, city)

  let jobs: any[] = []
  try {
    jobs = await prisma.job.findMany({
      where: {
        ...geoWhere,
        ...(params.sponsorship === 'true' ? { sponsorship: true } : {}),
        ...(params.type ? { type: params.type as any } : {}),
      },
      include: { postedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch {
    // DB not connected
  }

  return (
    <div className="np-page-wrap np-2col-left">
      <div className="np-hide-mobile" style={{ position: 'sticky', top: 120 }}>
        <JobsRail city={city ?? ''} country={country} state={state} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--fg-1)' }}>
            Jobs · {geoLabel}
          </h1>
          <a href="/jobs/new" className="np-btn np-btn-primary sm">
            Post a job
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.length === 0 ? (
            <div className="np-card np-empty">
              <h3>No jobs for {geoLabel} right now.</h3>
              <p style={{ fontSize: 14, marginTop: 4 }}>Be the first to post a role for your community.</p>
            </div>
          ) : (
            jobs.map((job: any) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </div>
  )
}
