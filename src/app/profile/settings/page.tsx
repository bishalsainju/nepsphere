import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to profile
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 24 }}>
        Account settings
      </h1>

      <div className="np-card np-empty">
        <h3>Sign in to manage your settings.</h3>
        <Link href="/signin" className="np-btn np-btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
          Sign in
        </Link>
      </div>
    </div>
  )
}
