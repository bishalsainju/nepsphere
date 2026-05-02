import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConnectClient } from './ConnectClient'
import Link from 'next/link'

export default async function ConnectPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>💕</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)', marginBottom: 8 }}>
          Sign in to use Connect
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-3)', marginBottom: 28, lineHeight: 1.6 }}>
          Meet Nepalis near you — for friendship, dating, or marriage.
        </p>
        <Link href="/signin?callbackUrl=/connect" className="np-btn np-btn-primary lg">
          Sign in to continue
        </Link>
      </div>
    )
  }

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>Loading…</div>}>
      <ConnectClient />
    </Suspense>
  )
}
