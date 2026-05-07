'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CITIES = ['Dallas', 'Houston', 'Austin', 'New York', 'San Jose', 'Toronto', 'Vancouver', 'Sydney']
const JOB_TYPES = [
  { value: 'FULL_TIME',  label: 'Full-time' },
  { value: 'PART_TIME',  label: 'Part-time' },
  { value: 'CONTRACT',   label: 'Contract' },
  { value: 'GIG',        label: 'Gig' },
  { value: 'INTERNSHIP', label: 'Internship' },
]

export function JobForm() {
  const { status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', company: '', description: '', type: 'FULL_TIME',
    location: '', city: 'Dallas', salary: '', sponsorship: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
        return
      }
      const job = await res.json()
      router.push(`/jobs/${job.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 8, color: 'var(--fg-1)' }}>Sign in to post a job</h3>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', marginBottom: 20 }}>You need to be signed in to post a job listing.</p>
        <Link href="/signin?callbackUrl=/jobs/new" style={{ display: 'inline-block', padding: '10px 28px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Sign in with Google
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="np-form-2col">
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Job title</label>
          <input className="np-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Software Engineer" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company</label>
          <input className="np-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" required />
        </div>
      </div>

      <div className="np-form-2col">
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Job type</label>
          <select className="np-input" value={form.type} onChange={e => set('type', e.target.value)}>
            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>City</label>
          <select className="np-input" value={form.city} onChange={e => set('city', e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="np-form-2col">
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Location (full)</label>
          <input className="np-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Dallas, TX (Remote OK)" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Salary range (optional)</label>
          <input className="np-input" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="$80,000 – $120,000" />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
        <textarea className="np-input" rows={6} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Role responsibilities, requirements, and any additional info…" required style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
        <input type="checkbox" checked={form.sponsorship} onChange={e => set('sponsorship', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--primary-600)' }} />
        <span>Visa sponsorship available <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>(never "guaranteed")</span></span>
      </label>

      {error && <p style={{ color: 'var(--crimson-500)', fontSize: 14 }}>{error}</p>}

      <button type="submit" className="np-btn np-btn-primary lg" disabled={loading}>
        {loading ? 'Posting…' : 'Post job'}
      </button>
    </form>
  )
}
