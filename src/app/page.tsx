import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const PRODUCT_CARDS = [
  {
    href: '/community',
    title: 'Community',
    desc: 'Ask anything. Help someone. Discussions, Q&A, and interest groups — scoped to your city.',
    color: '#3B82F6',
    emoji: '💬',
  },
  {
    href: '/rooms',
    title: 'Rooms',
    desc: 'Find a room with people you trust. Physical listings filtered by city, price, and preference.',
    color: '#EA580C',
    emoji: '🏠',
  },
  {
    href: '/connect',
    title: 'Connect',
    desc: 'Meet Nepalis looking for meaningful connections. Friendship, dating, or marriage — you choose.',
    color: '#E31C5F',
    emoji: '🤝',
  },
  {
    href: '/jobs',
    title: 'Jobs',
    desc: 'Opportunities shared by your community. With visa sponsorship filters built in.',
    color: '#059669',
    emoji: '💼',
  },
]

const TRUST_STATS = [
  { label: 'Verified members', value: '12,400+' },
  { label: 'Cities covered', value: '18' },
  { label: 'Rooms listed', value: '3,200+' },
  { label: 'Jobs posted', value: '840+' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Logo size={64} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--fg-1)',
          marginBottom: 20,
        }}>
          Find help. Find rooms.<br />
          <span style={{ color: 'var(--primary)' }}>Build real connections.</span>
        </h1>
        <p style={{ fontSize: 20, color: 'var(--fg-3)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
          The trusted home base for Nepalis living abroad. Verified neighbors only.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/community"
            style={{
              padding: '14px 32px', borderRadius: 12,
              background: 'var(--primary)', color: 'white',
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            Explore your city
          </Link>
          <Link
            href="/signin"
            style={{
              padding: '14px 32px', borderRadius: 12,
              background: 'var(--surface)', color: 'var(--fg-1)',
              border: '1px solid var(--border)',
              fontWeight: 600, fontSize: 16, textDecoration: 'none',
            }}
          >
            Join Nepsphere
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {TRUST_STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 product cards */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, textAlign: 'center', marginBottom: 40, color: 'var(--fg-1)' }}>
          Everything your community needs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PRODUCT_CARDS.map(card => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div className="np-card interactive" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 36 }}>{card.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--fg-1)', margin: 0 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {card.desc}
                </p>
                <div style={{ fontSize: 14, fontWeight: 600, color: card.color }}>
                  Explore {card.title.toLowerCase()} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust / verification section */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🇳🇵</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--fg-1)', marginBottom: 16 }}>
            Built on trust, not anonymity
          </h2>
          <p style={{ fontSize: 17, color: 'var(--fg-2)', lineHeight: 1.7, marginBottom: 32 }}>
            Every member verifies their identity. No fake profiles, no random DMs from strangers.
            Your neighborhood — but wherever you live in the world.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--fg-2)' }}>
              <span style={{ color: 'var(--emerald-500)', fontWeight: 700 }}>✓</span> ID verified members
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--fg-2)' }}>
              <span style={{ color: 'var(--emerald-500)', fontWeight: 700 }}>✓</span> Community moderation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--fg-2)' }}>
              <span style={{ color: 'var(--emerald-500)', fontWeight: 700 }}>✓</span> Intention-clear Connect
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Logo size={22} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>Nepsphere</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--fg-4)', margin: 0 }}>
          The trusted home base for Nepalis living abroad.
        </p>
      </footer>
    </div>
  )
}
