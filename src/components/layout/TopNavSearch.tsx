'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Bell } from 'lucide-react'

export function TopNavSearch() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const q = encodeURIComponent(query.trim())
    router.push(`/community?q=${q}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <>
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
          onClick={() => { setSearchOpen(false); setQuery('') }}
        >
          <form
            onSubmit={handleSearch}
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 560, margin: '0 16px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
          >
            <Search size={18} strokeWidth={1.5} style={{ color: 'var(--fg-3)', flexShrink: 0, marginLeft: 18 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search community, jobs, rooms…"
              style={{ flex: 1, padding: '18px 14px', border: 'none', outline: 'none', fontSize: 16, fontFamily: 'inherit', background: 'transparent', color: 'var(--fg-1)' }}
            />
            <button type="button" onClick={() => { setSearchOpen(false); setQuery('') }} style={{ padding: '0 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)' }}>
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setSearchOpen(true)}
        style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Search"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>
      <button
        onClick={() => alert('Notifications coming soon!')}
        style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Notifications"
      >
        <Bell size={18} strokeWidth={1.5} />
      </button>
    </>
  )
}
