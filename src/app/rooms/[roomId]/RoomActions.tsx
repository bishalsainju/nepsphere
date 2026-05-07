'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark, BookmarkCheck, MessageCircle, X, Send } from 'lucide-react'

export function RoomActions({ roomId, hostName, hostEmail }: { roomId: string; hostName: string; hostEmail?: string | null }) {
  const { data: session, status } = useSession()
  const [saved,        setSaved]        = useState(false)
  const [savingLoad,   setSavingLoad]   = useState(false)
  const [showContact,  setShowContact]  = useState(false)
  const [message,      setMessage]      = useState('')
  const [sending,      setSending]      = useState(false)
  const [sent,         setSent]         = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/rooms/${roomId}/save`)
      .then(r => r.json())
      .then(d => setSaved(d.saved ?? false))
      .catch(() => {})
  }, [roomId, status])

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
      const res = await fetch(`/api/rooms/${roomId}/save`, { method: 'POST' })
      const d   = await res.json()
      setSaved(d.saved)
    } finally {
      setSavingLoad(false)
    }
  }

  async function sendMessage() {
    if (!message.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toRoomId: roomId, body: message }),
      })
      setSent(true)
      setMessage('')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {showContact && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowContact(false) }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button onClick={() => setShowContact(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}>
              <X size={18} />
            </button>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--fg-1)' }}>
              Contact {hostName}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)' }}>
              Send a message about this room. They&apos;ll reply via the app.
            </p>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#059669', fontSize: 15, fontWeight: 600 }}>
                ✓ Message sent! The host will get back to you.
              </div>
            ) : (
              <>
                <textarea
                  style={{ width: '100%', minHeight: 100, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', background: 'var(--surface)', color: 'var(--fg-1)', boxSizing: 'border-box' }}
                  placeholder={`Hi ${hostName}, I'm interested in this room…`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowContact(false)} style={{ padding: '9px 18px', borderRadius: 9999, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-2)' }}>
                    Cancel
                  </button>
                  <button
                    disabled={!message.trim() || sending}
                    onClick={sendMessage}
                    style={{ padding: '9px 20px', borderRadius: 9999, border: 'none', background: 'var(--primary)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: (!message.trim() || sending) ? 0.5 : 1 }}
                  >
                    <Send size={14} /> {sending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => { if (requireAuth()) setShowContact(true) }}
        className="np-btn np-btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15, padding: '12px 0', display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <MessageCircle size={16} strokeWidth={1.5} /> Contact host
      </button>
      <button
        onClick={toggleSave}
        disabled={savingLoad}
        className="np-btn np-btn-secondary"
        style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        {saved
          ? <><BookmarkCheck size={15} style={{ color: 'var(--primary)' }} /> Saved</>
          : <><Bookmark size={15} /> Save listing</>
        }
      </button>
    </>
  )
}
