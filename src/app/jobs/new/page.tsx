import { JobForm } from '@/components/jobs/JobForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewJobPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Jobs
      </Link>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 6 }}>
          Post a job
        </h1>
        <p style={{ color: 'var(--fg-3)', fontSize: 15, margin: 0 }}>
          Post a role for free. Sponsorship-available roles get a badge.
        </p>
      </div>

      <div className="np-card" style={{ padding: 28 }}>
        <JobForm />
      </div>
    </div>
  )
}
