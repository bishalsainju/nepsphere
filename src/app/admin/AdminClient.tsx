'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Shield, Trash2, Eye, EyeOff, ArrowRight, LayoutDashboard, Users, FileText, Briefcase, Home, Heart } from 'lucide-react'

type Tab = 'overview' | 'users' | 'posts' | 'jobs' | 'rooms' | 'connect'

function timeAgo(date: Date | string) {
  const d = new Date(date)
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

async function adminAction(type: string, id: string, value?: any) {
  await fetch('/api/admin/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, value }),
  })
}

export function AdminClient({ stats, initialUsers, initialPosts, initialJobs, initialRooms, initialConnect }: {
  stats: Record<string, number>
  initialUsers: any[]
  initialPosts: any[]
  initialJobs: any[]
  initialRooms: any[]
  initialConnect: any[]
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [users,   setUsers]   = useState(initialUsers)
  const [posts,   setPosts]   = useState(initialPosts)
  const [jobs,    setJobs]    = useState(initialJobs)
  const [rooms,   setRooms]   = useState(initialRooms)
  const [connect, setConnect] = useState(initialConnect)
  const [pending, startTransition] = useTransition()

  const STAT_CARDS = [
    { label: 'Total users',      value: stats.totalUsers,     color: '#3B82F6', icon: Users },
    { label: 'Verified users',   value: stats.verifiedUsers,  color: '#059669', icon: Shield },
    { label: 'Community posts',  value: stats.totalPosts,     color: '#7C3AED', icon: FileText },
    { label: 'Rooms listed',     value: stats.totalRooms,     color: '#EA580C', icon: Home },
    { label: 'Jobs posted',      value: stats.totalJobs,      color: '#0EA5E9', icon: Briefcase },
    { label: 'Connect profiles', value: stats.totalConnect,   color: '#E31C5F', icon: Heart },
    { label: 'Groups',           value: stats.totalGroups,    color: '#F59E0B', icon: LayoutDashboard },
  ]

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users',    label: `Users (${stats.totalUsers})`, icon: Users },
    { id: 'posts',    label: 'Posts',    icon: FileText },
    { id: 'jobs',     label: 'Jobs',     icon: Briefcase },
    { id: 'rooms',    label: 'Rooms',    icon: Home },
    { id: 'connect',  label: 'Connect',  icon: Heart },
  ]

  function toggleVerify(userId: string, cur: boolean) {
    startTransition(async () => {
      await adminAction('verify_user', userId, !cur)
      setUsers(us => us.map(u => u.id === userId ? { ...u, isVerified: !cur } : u))
    })
  }

  function toggleAdmin(userId: string, cur: boolean) {
    startTransition(async () => {
      await adminAction('admin_user', userId, !cur)
      setUsers(us => us.map(u => u.id === userId ? { ...u, isAdmin: !cur } : u))
    })
  }

  function deletePost(id: string) {
    startTransition(async () => {
      await adminAction('delete_post', id)
      setPosts(ps => ps.filter(p => p.id !== id))
    })
  }

  function deleteJob(id: string) {
    startTransition(async () => {
      await adminAction('delete_job', id)
      setJobs(js => js.filter(j => j.id !== id))
    })
  }

  function deleteRoom(id: string) {
    startTransition(async () => {
      await adminAction('delete_room', id)
      setRooms(rs => rs.filter(r => r.id !== id))
    })
  }

  function toggleConnect(id: string, cur: boolean) {
    startTransition(async () => {
      await adminAction('toggle_connect', id, !cur)
      setConnect(cs => cs.map(c => c.id === id ? { ...c, isVisible: !cur } : c))
    })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)', margin: '0 0 4px' }}>
          Admin dashboard
        </h1>
        <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 14 }}>Manage Nepsphere platform</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border-subtle)', marginBottom: 28, overflowX: 'auto' }}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 16px', border: 'none', background: 'transparent',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: tab === t.id ? 'var(--primary)' : 'var(--fg-3)',
                borderBottom: `2px solid ${tab === t.id ? 'var(--primary)' : 'transparent'}`,
                marginBottom: -1, whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <Icon size={14} strokeWidth={1.8} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12, marginBottom: 32 }}>
            {STAT_CARDS.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="np-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} strokeWidth={1.8} style={{ color: s.color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {s.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Recent users */}
            <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>Recent sign-ups</div>
                <button onClick={() => setTab('users')} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Manage <ArrowRight size={11} />
                </button>
              </div>
              {users.slice(0, 8).map((u, i) => (
                <div key={u.id} style={{ padding: '10px 18px', borderBottom: i < 7 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${u.id.charCodeAt(0) * 17 % 360},55%,60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {(u.name ?? u.email)[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name ?? u.email.split('@')[0]}</span>
                      {u.isAdmin    && <span style={{ fontSize: 9, fontWeight: 700, background: '#7C3AED', color: 'white', padding: '1px 5px', borderRadius: 9999, flexShrink: 0 }}>Admin</span>}
                      {u.isVerified && !u.isAdmin && <CheckCircle size={11} strokeWidth={2} style={{ color: '#059669', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>{u.city ?? '—'} · {timeAgo(u.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent posts */}
            <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>Recent posts</div>
                <button onClick={() => setTab('posts')} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Manage <ArrowRight size={11} />
                </button>
              </div>
              {posts.slice(0, 8).map((p, i) => (
                <Link key={p.id} href={`/community/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 18px', borderBottom: i < 7 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>{p.city} · {p.author?.name ?? '—'} · {timeAgo(p.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                  {['Name', 'Email', 'Location', 'Joined', 'Verified', 'Admin'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--fg-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${u.id.charCodeAt(0) * 17 % 360},50%,60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                          {(u.name ?? u.email)[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{u.name ?? '—'}</span>
                        {u.isAdmin && <span style={{ fontSize: 9, fontWeight: 700, background: '#7C3AED15', color: '#7C3AED', border: '1px solid #7C3AED30', padding: '1px 6px', borderRadius: 9999 }}>Admin</span>}
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', color: 'var(--fg-2)' }}>{u.email}</td>
                    <td style={{ padding: '11px 16px', color: 'var(--fg-3)' }}>{[u.city, u.state].filter(Boolean).join(', ') || '—'}</td>
                    <td style={{ padding: '11px 16px', color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{timeAgo(u.createdAt)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <button
                        onClick={() => toggleVerify(u.id, u.isVerified)}
                        disabled={pending}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                          background: u.isVerified ? '#D1FAE5' : 'var(--surface-2)', color: u.isVerified ? '#065F46' : 'var(--fg-3)' }}
                      >
                        {u.isVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <button
                        onClick={() => toggleAdmin(u.id, u.isAdmin)}
                        disabled={pending}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                          background: u.isAdmin ? '#EDE9FE' : 'var(--surface-2)', color: u.isAdmin ? '#5B21B6' : 'var(--fg-3)' }}
                      >
                        <Shield size={12} />
                        {u.isAdmin ? 'Admin' : 'User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Posts ── */}
      {tab === 'posts' && (
        <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                {['Title', 'Category', 'Author', 'Location', 'Posted', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--fg-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', maxWidth: 300 }}>
                    <Link href={`/community/${p.id}`} style={{ fontWeight: 600, color: 'var(--fg-1)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{p.category}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-2)' }}>{p.author?.name ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{p.city}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{timeAgo(p.createdAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <button
                      onClick={() => deletePost(p.id)}
                      disabled={pending}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: '1px solid #FCA5A5', background: '#FFF5F5', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600 }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Jobs ── */}
      {tab === 'jobs' && (
        <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                {['Title', 'Company', 'Type', 'Location', 'Sponsorship', 'Posted', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--fg-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j, i) => (
                <tr key={j.id} style={{ borderBottom: i < jobs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', maxWidth: 240 }}>
                    <Link href={`/jobs/${j.id}`} style={{ fontWeight: 600, color: 'var(--fg-1)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {j.title}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-2)' }}>{j.company}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{j.type?.replace('_', ' ')}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{j.city}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {j.sponsorship
                      ? <span style={{ fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: 9999 }}>Visa</span>
                      : <span style={{ fontSize: 11, color: 'var(--fg-4)' }}>No</span>}
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{timeAgo(j.createdAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <button
                      onClick={() => deleteJob(j.id)}
                      disabled={pending}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: '1px solid #FCA5A5', background: '#FFF5F5', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600 }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Rooms ── */}
      {tab === 'rooms' && (
        <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                {['Title', 'Price', 'Type', 'Location', 'Host', 'Listed', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--fg-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < rooms.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', maxWidth: 240 }}>
                    <Link href={`/rooms/${r.id}`} style={{ fontWeight: 600, color: 'var(--fg-1)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {r.title}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--fg-1)' }}>${r.price}/mo</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{r.type?.replace('_', ' ')}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{r.city}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-2)' }}>{r.host?.name ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{timeAgo(r.createdAt)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <button
                      onClick={() => deleteRoom(r.id)}
                      disabled={pending}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: '1px solid #FCA5A5', background: '#FFF5F5', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600 }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Connect ── */}
      {tab === 'connect' && (
        <div className="np-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
                {['Member', 'Intent', 'Age', 'Location', 'Hometown', 'Religion', 'Visible', 'Created'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--fg-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {connect.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < connect.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <Link href={`/connect/${c.userId}`} style={{ fontWeight: 600, color: 'var(--fg-1)', textDecoration: 'none' }}>
                      {c.user?.name ?? '—'}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {(c.intents ?? []).map((intId: string) => (
                        <span key={intId} style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 9999, background: intId === 'DATING' ? '#FFF1F2' : intId === 'MARRIAGE' ? '#ECFDF5' : '#EFF6FF', color: intId === 'DATING' ? '#E31C5F' : intId === 'MARRIAGE' ? '#0E9F6E' : '#3B82F6' }}>
                          {intId}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-2)' }}>{c.age ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{c.city ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{c.hometown ?? '—'}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-3)' }}>{c.religion ?? '—'}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <button
                      onClick={() => toggleConnect(c.id, c.isVisible)}
                      disabled={pending}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                        background: c.isVisible ? '#D1FAE5' : 'var(--surface-2)', color: c.isVisible ? '#065F46' : 'var(--fg-3)' }}
                    >
                      {c.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {c.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '10px 16px', color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>{timeAgo(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
