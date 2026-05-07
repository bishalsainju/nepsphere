'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark, BookmarkCheck, ArrowRight, X, Send, CheckCircle, UserCircle2 } from 'lucide-react'
import Link from 'next/link'

export function JobActions({ jobId, jobTitle, company }: { jobId: string; jobTitle: string; company: string }) {
  const { data: session, status } = useSession()
  const [saved,          setSaved]          = useState(false)
  const [applied,        setApplied]        = useState(false)
  const [hasJobProfile,  setHasJobProfile]  = useState<boolean | null>(null)
  const [savingLoad,     setSavingLoad]     = useState(false)
  const [showApply,      setShowApply]      = useState(false)
  const [showNeedProfile, setShowNeedProfile] = useState(false)
  const [note,           setNote]           = useState('')
  const [submitting,     setSubmitting]     = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch(`/api/jobs/${jobId}/save`).then(r => r.json()),
      fetch(`/api/jobs/${jobId}/apply`).then(r => r.json()),
      fetch('/api/jobs/profile').then(r => r.json()),
    ]).then(([saveData, applyData, profileData]) => {
      setSaved(saveData.saved ?? false)
      setApplied(applyData.applied ?? false)
      setHasJobProfile(!!(profileData?.headline?.trim() && profileData?.about?.trim()))
    }).catch(() => {})
  }, [jobId, status])

  function requireAuth() {
    if (status === 'loading') return false
    if (status === 'unauthenticated') {
      window.location.href = '/signin?callbackUrl=' + window.location.pathname
      return false
    }
    return true
  }

  async function toggleSave() {
    if (!requireAuth()) return
    setSavingLoad(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: 'POST' })
      const d = await res.json()
      setSaved(d.saved)
    } finally {
      setSavingLoad(false)
    }
  }

  function handleApplyClick() {
    if (!requireAuth()) return
    if (hasJobProfile === false) {
      setShowNeedProfile(true)
      return
    }
    setShowApply(true)
  }

  async function submitApplication() {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.profileRequired) {
        setShowApply(false)
        setShowNeedProfile(true)
        return
      }
      setApplied(true)
      setShowApply(false)
    } finally {
      setSubmitting(false)
    }
  }

  const returnTo = encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : `/jobs/${jobId}`)

  return (
    <>
      {showNeedProfile && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowNeedProfile(false) }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowNeedProfile(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}>
              <X size={18} />
            </button>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UserCircle2 size={28} style={{ color: 'white' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--fg-1)' }}>
              Create your job profile first
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.6 }}>
              Employers see your headline, experience, and resume when you apply to <strong>{jobTitle}</strong>. Takes about 2 minutes to set up.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href={`/jobs/profile/setup?returnTo=${returnTo}`}
                style={{ display: 'block', padding: '12px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
              >
                Create job profile
              </Link>
              <button
                onClick={() => setShowNeedProfile(false)}
                style={{ padding: '12px', borderRadius: 9999, border: '1px solid var(--border)', background: 'transparent', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-2)' }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {showApply && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowApply(false) }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setShowApply(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}>
              <X size={18} />
            </button>
            <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--fg-1)' }}>
              Apply — {jobTitle}
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--fg-3)' }}>{company}</p>

            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Cover note (optional)
            </label>
            <textarea
              style={{ width: '100%', minHeight: 120, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', background: 'var(--surface)', color: 'var(--fg-1)', boxSizing: 'border-box' }}
              placeholder="Briefly introduce yourself and why you're a good fit…"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowApply(false)} style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-2)' }}>
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={submitApplication}
                style={{ padding: '9px 22px', borderRadius: 9999, border: 'none', background: 'var(--primary)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: submitting ? 0.6 : 1 }}
              >
                <Send size={14} /> {submitting ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
        {applied ? (
          <button
            disabled
            className="np-btn np-btn-primary lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#059669', borderColor: '#059669', cursor: 'default', opacity: 0.9 }}
          >
            <CheckCircle size={16} strokeWidth={2} /> Applied
          </button>
        ) : (
          <button
            onClick={handleApplyClick}
            className="np-btn np-btn-primary lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Apply now <ArrowRight size={16} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={toggleSave}
          disabled={savingLoad}
          className="np-btn np-btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
        >
          {saved
            ? <><BookmarkCheck size={15} style={{ color: 'var(--primary)' }} /> Saved</>
            : <><Bookmark size={15} /> Save job</>
          }
        </button>
      </div>
    </>
  )
}
