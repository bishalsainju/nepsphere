'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Home, HeartHandshake, Briefcase } from 'lucide-react'

const TABS = [
  { href: '/community', label: 'Community', Icon: MessageSquare },
  { href: '/rooms',     label: 'Rooms',     Icon: Home },
  { href: '/connect',   label: 'Connect',   Icon: HeartHandshake },
  { href: '/jobs',      label: 'Jobs',      Icon: Briefcase },
]

export function BottomNav() {
  const path = usePathname()
  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(250,250,247,0.96)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        zIndex: 50,
      }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textDecoration: 'none',
              color: active ? 'var(--primary)' : 'var(--fg-3)',
              fontSize: 11,
              fontWeight: active ? 700 : 400,
              fontFamily: 'var(--font-body)',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
