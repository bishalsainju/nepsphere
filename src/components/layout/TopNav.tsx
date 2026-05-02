import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Logo } from '@/components/ui/Logo'
import { Search, Bell, LayoutDashboard } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/community', label: 'Community' },
  { href: '/rooms',     label: 'Rooms' },
  { href: '/connect',   label: 'Connect' },
  { href: '/jobs',      label: 'Jobs' },
]

export async function TopNav() {
  const session = await getServerSession(authOptions)
  const isAdmin = (session?.user as any)?.isAdmin ?? false

  return (
    <nav style={{
      height: 56,
      background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 8,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 16 }}>
        <Logo size={28} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>
          Nepsphere
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1 flex-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--fg-2)',
              textDecoration: 'none',
              transition: 'background 180ms, color 180ms',
            }}
            className="hover:bg-warm-100 hover:text-warm-900"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="np-topnav-icons" style={{ alignItems: 'center', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} strokeWidth={1.5} />
          </button>
        </div>

        {isAdmin && (
          <Link href="/admin" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '7px 13px',
            borderRadius: 12,
            background: '#7C3AED18',
            color: '#7C3AED',
            border: '1px solid #7C3AED30',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            <LayoutDashboard size={14} strokeWidth={1.8} />
            Admin
          </Link>
        )}

        {session ? (
          <Link href="/profile" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 12,
            background: 'var(--surface-2)',
            fontSize: 14, fontWeight: 600, color: 'var(--fg-1)',
            textDecoration: 'none', border: '1px solid var(--border)',
          }}>
            {session.user?.image ? (
              <img src={session.user.image} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
                {(session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="np-topnav-name">{session.user?.name?.split(' ')[0] ?? 'Profile'}</span>
          </Link>
        ) : (
          <Link href="/signin" style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: 'var(--primary)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
