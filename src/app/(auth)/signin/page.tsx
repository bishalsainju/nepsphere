'use client'
import { signIn } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: 24 }}>
      <div className="np-card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo size={52} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 6 }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--fg-3)', marginBottom: 32, fontSize: 15 }}>
          Sign in to keep your community safe.
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/community' })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '13px 20px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--fg-1)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 180ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ fontSize: 13, color: 'var(--fg-4)', marginTop: 24, lineHeight: 1.6 }}>
          By signing in you agree to our community guidelines.
          <br />
          New to Nepsphere?{' '}
          <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
