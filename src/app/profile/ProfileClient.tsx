'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Settings, MapPin, CheckCircle, Shield, MessageSquare, Briefcase, Home, Heart, LogOut, Edit, Eye, EyeOff } from 'lucide-react'

type Tab = 'community' | 'connect' | 'jobs' | 'rooms'

const CATEGORY_LABELS: Record<string, string> = {
  VISA: 'Visa', JOBS: 'Jobs', LIFE_ABROAD: 'Life abroad',
  STUDENT: 'Student', FOOD_CULTURE: 'Food & culture', GENERAL: 'General',
}
const ROOM_TYPES: Record<string, string> = {
  PRIVATE: 'Private room', SHARED: 'Shared', STUDIO: 'Studio', ENTIRE_APT: 'Entire apt',
}
const JOB_TYPES: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', GIG: 'Gig', INTERNSHIP: 'Internship',
}
const INTENT_LABELS: Record<string, string> = { FRIENDSHIP: 'Friendship', DATING: 'Dating', MARRIAGE: 'Marriage' }
const INTENT_COLORS: Record<string, string> = { FRIENDSHIP: '#3B82F6', DATING: '#E31C5F', MARRIAGE: '#0E9F6E' }
const GENDER_LABELS: Record<string, string> = { MALE: 'Man', FEMALE: 'Woman', NON_BINARY: 'Non-binary', OTHER: 'Other' }

function timeAgo(date: Date | string) {
  const d = new Date(date)
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function LikerRow({ profile, isMatch }: { profile: any; isMatch: boolean }) {
  const color = INTENT_COLORS[(profile.intents ?? [])[0] ?? ''] ?? '#6B7280'
  const initials = (profile.user.name ?? 'NS').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {profile.user.image
          ? <img src={profile.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{initials}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {profile.user.name ?? 'Nepali member'}
          {isMatch && <span style={{ fontSize: 10, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 7px', borderRadius: 9999 }}>Match</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          {profile.age && <span>{profile.age} yrs</span>}
          {profile.city && <span>· {profile.city}</span>}
          {(profile.intents ?? []).map((intId: string) => (
            <span key={intId} style={{ background: (INTENT_COLORS[intId] ?? '#6B7280') + '15', color: INTENT_COLORS[intId] ?? '#6B7280', padding: '1px 7px', borderRadius: 9999, fontWeight: 600 }}>{INTENT_LABELS[intId] ?? intId}</span>
          ))}
        </div>
      </div>
      <Link href={`/connect/${profile.userId}`} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 9999, border: `1.5px solid ${color}`, color, fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
        View
      </Link>
    </div>
  )
}

function JobRow({ j, badge, badgeColor }: { j: any; badge?: string; badgeColor?: string }) {
  return (
    <Link href={`/jobs/${j.id}`} style={{ textDecoration: 'none' }}>
      <div className="np-card interactive" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 4 }}>{j.title}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-4)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--fg-2)' }}>{j.company}</span>
            <span>·</span>
            <span style={{ fontWeight: 700, color: '#0EA5E9', background: '#E0F2FE', padding: '1px 7px', borderRadius: 9999, fontSize: 11 }}>{JOB_TYPES[j.type] ?? j.type}</span>
            <span>·</span>
            <span>{j.city}</span>
            {j.sponsorship && <span style={{ fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '1px 7px', borderRadius: 9999 }}>Visa</span>}
            {badge && <span style={{ fontSize: 11, fontWeight: 700, background: (badgeColor ?? '#059669') + '18', color: badgeColor ?? '#059669', padding: '1px 7px', borderRadius: 9999 }}>{badge}</span>}
            <span>·</span>
            <span>{timeAgo(j.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function RoomRow({ r }: { r: any }) {
  return (
    <Link href={`/rooms/${r.id}`} style={{ textDecoration: 'none' }}>
      <div className="np-card interactive" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 4 }}>{r.title}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-4)', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--fg-1)' }}>${r.price}/mo</span>
            <span>·</span>
            <span style={{ fontWeight: 700, color: '#EA580C', background: '#FFF7ED', padding: '1px 7px', borderRadius: 9999, fontSize: 11 }}>{ROOM_TYPES[r.type] ?? r.type}</span>
            <span>·</span>
            <span>{r.city}</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: r.isAvailable ? '#059669' : 'var(--fg-4)' }}>{r.isAvailable ? 'Available' : 'Unavailable'}</span>
            <span>·</span>
            <span>{timeAgo(r.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CommunityPostsTab({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(p => p.filter(x => x.id !== id))
  }

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--fg-3)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
        <div style={{ fontSize: 15, marginBottom: 16 }}>You haven't posted anything yet.</div>
        <Link href="/community" style={{ padding: '9px 20px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          Start a discussion
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {posts.map(p => (
        <div key={p.id} className="np-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link href={`/community/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 4 }}>{p.title}</div>
            </Link>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-4)', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '1px 7px', borderRadius: 9999, fontSize: 11 }}>
                {CATEGORY_LABELS[p.category] ?? p.category}
              </span>
              <span>{p.city}</span>
              <span>·</span>
              <span>{p._count.replies} {p._count.replies === 1 ? 'reply' : 'replies'}</span>
              <span>·</span>
              <span>{p.likes} likes</span>
              <span>·</span>
              <span>{timeAgo(p.createdAt)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Link href={`/community/${p.id}`} style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', textDecoration: 'none' }}>
              View
            </Link>
            <button
              onClick={() => deletePost(p.id)}
              style={{ padding: '5px 12px', borderRadius: 9999, border: '1px solid #FCA5A5', background: 'none', fontSize: 12, fontWeight: 600, color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ icon, label, cta, href }: { icon: string; label: string; cta: string; href: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--fg-3)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, marginBottom: 16 }}>{label}</div>
      <Link href={href} style={{ padding: '9px 20px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
        {cta}
      </Link>
    </div>
  )
}

export function ProfileClient({ user, posts, jobs, rooms, savedRooms, savedJobs, appliedJobs, connectProfile, connectStats, initialTab }: {
  user: any
  posts: any[]
  jobs: any[]
  rooms: any[]
  savedRooms: any[]
  savedJobs: any[]
  appliedJobs: any[]
  connectProfile: any
  connectStats: { likerProfiles: any[]; matches: any[]; likesReceived: number; unreadMessages: number }
  initialTab?: Tab
}) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'community')

  const TABS = [
    { id: 'community' as Tab, label: 'Community', count: posts.length,   icon: MessageSquare, color: '#7C3AED' },
    { id: 'connect'   as Tab, label: 'Connect',   count: connectStats.likesReceived + connectStats.matches.length, icon: Heart, color: '#E31C5F' },
    { id: 'jobs'      as Tab, label: 'Jobs',       count: jobs.length + savedJobs.length + appliedJobs.length, icon: Briefcase, color: '#0EA5E9' },
    { id: 'rooms'     as Tab, label: 'Rooms',      count: rooms.length + savedRooms.length, icon: Home, color: '#EA580C' },
  ]

  const initials = (user.name ?? user.email ?? 'U').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="np-page-wrap" style={{ maxWidth: 860 }}>

      {/* Header card */}
      <div className="np-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        {/* Banner */}
        <div style={{ height: 100, background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)', position: 'relative' }} />

        <div className="np-profile-header-body" style={{ padding: '0 24px 20px' }}>
          {/* Avatar */}
          <div style={{ marginTop: -36, marginBottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', boxShadow: '0 0 0 3px var(--surface)', overflow: 'hidden', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {user.image
                ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{initials}</span>}
            </div>
            <div className="np-profile-actions" style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
              <Link
                href="/profile/settings"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', textDecoration: 'none' }}
              >
                <Settings size={15} strokeWidth={1.8} />
                <span className="np-profile-action-text">Settings</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 9999, border: '1px solid #FCA5A5', background: '#FFF5F5', fontSize: 13, fontWeight: 600, color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <LogOut size={15} strokeWidth={1.8} />
                <span className="np-profile-action-text">Sign out</span>
              </button>
            </div>
          </div>

          {/* Name + badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--fg-1)', margin: 0 }}>
              {user.name ?? user.email}
            </h1>
            {user.isVerified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: 9999 }}>
                <CheckCircle size={11} /> Verified
              </span>
            )}
            {user.isAdmin && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, background: '#EDE9FE', color: '#5B21B6', padding: '2px 8px', borderRadius: 9999 }}>
                <Shield size={11} /> Admin
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-3)', alignItems: 'center' }}>
            {(user.city || user.state) && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} strokeWidth={1.5} />
                {[user.city, user.state].filter(Boolean).join(', ')}
              </span>
            )}
            <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="np-tabs-scroll" style={{ borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 2, minWidth: 'max-content' }}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 18px', border: 'none', background: 'transparent',
                fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                color: tab === t.id ? t.color : 'var(--fg-3)',
                borderBottom: `2px solid ${tab === t.id ? t.color : 'transparent'}`,
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} strokeWidth={1.8} />
              {t.label}
              <span style={{ fontSize: 11, fontWeight: 700, background: tab === t.id ? t.color + '18' : 'var(--surface-2)', color: tab === t.id ? t.color : 'var(--fg-4)', padding: '1px 6px', borderRadius: 9999 }}>
                {t.count}
              </span>
            </button>
          )
        })}
      </div>
      </div>

      {/* ── Community tab ── */}
      {tab === 'community' && (
        <CommunityPostsTab initialPosts={posts} />
      )}

      {/* ── Connect tab ── */}
      {tab === 'connect' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div className="np-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: '#E31C5F' }}>{connectStats.likesReceived}</div>
              <div style={{ fontSize: 12, color: '#E31C5F', fontWeight: 600, marginTop: 2 }}>Liked you</div>
            </div>
            <div className="np-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: '#0E9F6E' }}>{connectStats.matches.length}</div>
              <div style={{ fontSize: 12, color: '#0E9F6E', fontWeight: 600, marginTop: 2 }}>Matches</div>
            </div>
            <Link href="/connect/messages" style={{ textDecoration: 'none' }}>
              <div className="np-card interactive" style={{ padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: '#3B82F6' }}>{connectStats.unreadMessages}</div>
                <div style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600, marginTop: 2 }}>Unread msgs</div>
              </div>
            </Link>
          </div>

          {/* Matches section */}
          {connectStats.matches.length > 0 && (
            <div className="np-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0E9F6E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Matches — {connectStats.matches.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {connectStats.matches.map((p: any) => (
                  <LikerRow key={p.userId} profile={p} isMatch />
                ))}
              </div>
            </div>
          )}

          {/* People who liked you */}
          {connectStats.likerProfiles.length > 0 && (
            <div className="np-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#E31C5F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Liked you — {connectStats.likerProfiles.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {connectStats.likerProfiles.map((p: any) => (
                  <LikerRow key={p.userId} profile={p} isMatch={connectStats.matches.some((m: any) => m.userId === p.userId)} />
                ))}
              </div>
            </div>
          )}

          {connectStats.likerProfiles.length === 0 && (
            <div className="np-card np-empty">
              <div style={{ fontSize: 32, marginBottom: 8 }}>💕</div>
              <h3 style={{ margin: '0 0 6px' }}>No likes yet</h3>
              <p style={{ fontSize: 14, marginTop: 4 }}>
                {connectProfile ? 'Keep your profile visible to get discovered.' : 'Create a Connect profile to start meeting people.'}
              </p>
              {!connectProfile && (
                <Link href="/connect/setup" style={{ display: 'inline-block', marginTop: 14, padding: '9px 22px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  Create profile
                </Link>
              )}
            </div>
          )}

          {/* Your profile card */}
          {connectProfile && (
            <div className="np-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {(connectProfile.intents ?? []).map((intId: string) => (
                      <span key={intId} style={{ background: (INTENT_COLORS[intId] ?? '#6B7280') + '18', color: INTENT_COLORS[intId] ?? '#6B7280', fontWeight: 700, fontSize: 12, padding: '3px 12px', borderRadius: 9999 }}>
                        {INTENT_LABELS[intId] ?? intId}
                      </span>
                    ))}
                  </div>
                  {connectProfile.isVisible
                    ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#059669' }}><Eye size={12} /> Visible</span>
                    : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--fg-4)' }}><EyeOff size={12} /> Hidden</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/connect/${connectProfile.userId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 9999, border: `1.5px solid ${INTENT_COLORS[(connectProfile.intents ?? [])[0] ?? ''] ?? '#6B7280'}`, color: INTENT_COLORS[(connectProfile.intents ?? [])[0] ?? ''] ?? '#6B7280', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                    <Eye size={13} /> View
                  </Link>
                  <Link href="/connect/edit" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>
                    <Edit size={13} /> Edit
                  </Link>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {connectProfile.age      && <span><strong>{connectProfile.age}</strong> yrs</span>}
                {connectProfile.gender   && <span>{GENDER_LABELS[connectProfile.gender] ?? connectProfile.gender}</span>}
                {connectProfile.city     && <span>{connectProfile.city}</span>}
                {connectProfile.hometown && <span>🇳🇵 {connectProfile.hometown}</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Jobs tab ── */}
      {tab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Posted jobs */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Posted by you ({jobs.length})
            </div>
            {jobs.length === 0
              ? <EmptyState icon="💼" label="You haven't posted any jobs yet." cta="Post a job" href="/jobs/new" />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {jobs.map(j => <JobRow key={j.id} j={j} />)}
                </div>
              )}
          </div>

          {/* Applied jobs */}
          {appliedJobs.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Applied ({appliedJobs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {appliedJobs.map(j => <JobRow key={j.id} j={j} badge="Applied" badgeColor="#059669" />)}
              </div>
            </div>
          )}

          {/* Saved jobs */}
          {savedJobs.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Saved ({savedJobs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedJobs.map(j => <JobRow key={j.id} j={j} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Rooms tab ── */}
      {tab === 'rooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Listed rooms */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Listed by you ({rooms.length})
            </div>
            {rooms.length === 0
              ? <EmptyState icon="🏠" label="You haven't listed any rooms yet." cta="List a room" href="/rooms/new" />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {rooms.map(r => <RoomRow key={r.id} r={r} />)}
                </div>
              )}
          </div>

          {/* Saved rooms */}
          {savedRooms.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EA580C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Saved ({savedRooms.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedRooms.map(r => <RoomRow key={r.id} r={r} />)}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
