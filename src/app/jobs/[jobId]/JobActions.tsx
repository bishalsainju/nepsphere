'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark, BookmarkCheck, ArrowRight, X, Send, CheckCircle } from 'lucide-react'

export function JobActions({ jobId, jobTitle, company }: { jobId: string; jobTitle: string; company: string }) {
  const { data: session, status } = useSession()
  const [saved,       setSaved]       = useState(false)
  const [applied,     setApplied]     = useState(false)
  const [savingLoad,  setSavingLoad]  = useState(false)
  const [showApply,   setShowApply]   = useState(false)
  const [note,        setNote]        = useState('')
  const [submitting,  setSubmitting]  = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch(`/api/jobs/${jobId}/save`).then(r => r.json()),
      fetch(`/api/jobs/${jobId}/apply`).then(r => r.json()),
    ]).then(([saveData, applyData]) => {
      setSaved(saveData.saved ?? false)
      setApplied(applyData.applied ?? false)
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
        const returnTo = encodeURIComponent(window.location.pathname)
        window.location.href = `/jobs/profile/setup?returnTo=${returnTo}`
        return
      }
      setApplied(true)
      setShowApply(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
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
            onClick={() => { if (requireAuth()) setShowApply(true) }}
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
