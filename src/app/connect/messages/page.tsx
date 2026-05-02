import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Link href="/connect" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Connect
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 20 }}>
        Messages
      </h1>

      <div className="np-card np-empty">
        <h3>No messages yet.</h3>
        <p style={{ fontSize: 14, marginTop: 4 }}>Sign in to keep your community safe.</p>
      </div>
    </div>
  )
}
