'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IntentPicker } from '@/components/connect/IntentPicker'
import { VerificationBanner } from '@/components/connect/VerificationBanner'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { UserCircle2, SlidersHorizontal, X, Heart, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

const INTENT_COLORS: Record<string, string> = {
  FRIENDSHIP: '#3B82F6', DATING: '#E31C5F', MARRIAGE: '#0E9F6E',
}
const INTENT_GRADIENTS: Record<string, string> = {
  FRIENDSHIP: 'linear-gradient(160deg, #BFDBFE 0%, #EFF6FF 100%)',
  DATING:     'linear-gradient(160deg, #FECDD3 0%, #FFF1F2 100%)',
  MARRIAGE:   'linear-gradient(160deg, #A7F3D0 0%, #ECFDF5 100%)',
}
const INTENT_LABELS: Record<string, string> = {
  FRIENDSHIP: 'Friendship', DATING: 'Dating', MARRIAGE: 'Marriage',
}
const GENDER_LABELS: Record<string, string> = {
  MALE: 'Man', FEMALE: 'Woman', NON_BINARY: 'Non-binary', OTHER: 'Other',
}
const GENDERS = [
  { value: '', label: 'Any gender' },
  { value: 'MALE', label: 'Men' },
  { value: 'FEMALE', label: 'Women' },
  { value: 'NON_BINARY', label: 'Non-binary' },
]
const RELIGIONS = ['Hindu', 'Buddhist', 'Kirat', 'Christian', 'Muslim', 'Secular']

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 9999,
      background: color ? color + '15' : 'var(--surface-2)',
      color: color ?? 'var(--fg-2)',
      border: `1px solid ${color ? color + '25' : 'var(--border)'}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

function ProfileCard({
  profile, animating,
}: {
  profile: any
  animating: 'like' | 'pass' | null
}) {
  const color    = INTENT_COLORS[profile.intent]  ?? '#6B7280'
  const gradient = INTENT_GRADIENTS[profile.intent] ?? 'linear-gradient(160deg,#F3F4F6,#FFFFFF)'
  const genderLabel = profile.gender ? GENDER_LABELS[profile.gender] ?? profile.gender : null

  const transform = animating === 'like'
    ? 'translateX(80px) rotate(8deg) scale(0.97)'
    : animating === 'pass'
    ? 'translateX(-80px) rotate(-8deg) scale(0.97)'
    : 'none'

  return (
    <div style={{
      transform,
      opacity: animating ? 0.3 : 1,
      transition: 'transform 0.22s ease, opacity 0.22s ease',
      borderRadius: 24,
      overflow: 'hidden',
      background: 'var(--surface)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.13)',
      width: '100%',
    }}>
      {/* Banner */}
      <div style={{ height: 200, background: gradient, position: 'relative', flexShrink: 0 }}>
        <span style={{
          position: 'absolute', top: 14, left: 14,
          background: color, color: 'white',
          fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 9999,
        }}>
          {INTENT_LABELS[profile.intent]}
        </span>
        <div style={{ position: 'absolute', left: '50%', bottom: -44, transform: 'translateX(-50%)' }}>
          <Avatar name={profile.user.name ?? 'NS'} size={88} intent={profile.intent.toLowerCase() as any} src={profile.user.image ?? undefined} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '56px 24px 24px', textAlign: 'center' }}>
        {/* Name */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {profile.user.name ?? 'Nepali member'}
          {profile.user.isVerified && <Badge size={16} />}
        </div>

        {/* Key info row */}
        <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          {profile.age && <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{profile.age}</span>}
          {profile.age && genderLabel && <span>·</span>}
          {genderLabel && <span>{genderLabel}</span>}
          {profile.height && <><span>·</span><span>{profile.height}</span></>}
          {profile.city && <><span>·</span><span>{profile.city}{profile.state ? `, ${profile.state.slice(0,2)}` : ''}</span></>}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65, margin: '14px 0 10px', textAlign: 'left' }}>
            {profile.bio.length > 200 ? profile.bio.slice(0, 200) + '…' : profile.bio}
          </p>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 12 }}>
          {profile.hometown && <Tag>🇳🇵 {profile.hometown}</Tag>}
          {profile.religion && <Tag>{profile.religion}</Tag>}
          {profile.caste    && <Tag>{profile.caste}</Tag>}
          {profile.occupation && <Tag>💼 {profile.occupation}</Tag>}
          {profile.education  && <Tag>🎓 {profile.education}</Tag>}
          {(profile.lookingFor ?? []).map((lf: string) => (
            <Tag key={lf} color={color}>{lf}</Tag>
          ))}
        </div>

        {/* Lifestyle row */}
        {(profile.dietary || profile.drinking || profile.smoking) && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-3)' }}>
            {profile.dietary   && <span>🍽 {profile.dietary}</span>}
            {profile.drinking  && <span>🥂 {profile.drinking}</span>}
            {profile.smoking === 'Never' && <span>🚭 Non-smoker</span>}
            {profile.smoking && profile.smoking !== 'Never' && <span>🚬 {profile.smoking}</span>}
          </div>
        )}

        {/* Languages */}
        {profile.language?.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-4)' }}>
            🗣 {profile.language.join(' · ')}
          </div>
        )}

        {/* View full profile */}
        <Link
          href={`/connect/${profile.user.id}`}
          style={{
            display: 'inline-block', marginTop: 18,
            padding: '9px 24px', borderRadius: 9999,
            background: 'transparent',
            border: `1.5px solid ${color}`,
            color, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          View full profile
        </Link>
      </div>
    </div>
  )
}

export function ConnectClient() {
  const searchParams = useSearchParams()
  const country = searchParams.get('country')
  const state   = searchParams.get('state')
  const city    = searchParams.get('city')

  const [intent, setIntent]   = useState<string | null>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [deck, setDeck]   = useState<any[]>([])
  const [idx, setIdx]     = useState(0)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [passed, setPassed] = useState<Set<string>>(new Set())
  const [animating, setAnimating] = useState<'like' | 'pass' | null>(null)
  const [myProfileUserId, setMyProfileUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/connect/profile')
      .then(r => r.ok ? r.json() : null)
      .then(p => { if (p?.userId) setMyProfileUserId(p.userId) })
      .catch(() => {})
  }, [])

  // Filters
  const [genderFilter,   setGenderFilter]   = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(60)
  const [religionFilter, setReligionFilter] = useState('')

  useEffect(() => {
    if (!intent) return
    setLoading(true)
    setIdx(0)
    setLiked(new Set())
    setPassed(new Set())

    const params = new URLSearchParams()
    params.set('intent', intent)
    if (country)       params.set('country', country)
    if (state)         params.set('state', state)
    if (city)          params.set('city', city)
    if (genderFilter)  params.set('gender', genderFilter)
    if (minAge !== 18) params.set('minAge', String(minAge))
    if (maxAge !== 60) params.set('maxAge', String(maxAge))
    if (religionFilter) params.set('religion', religionFilter)

    fetch(`/api/connect?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setProfiles(Array.isArray(data) ? data : []); setDeck(Array.isArray(data) ? data : []) })
      .catch(() => { setProfiles([]); setDeck([]) })
      .finally(() => setLoading(false))
  }, [intent, country, state, city, genderFilter, minAge, maxAge, religionFilter])

  const activeDeck = deck.filter(p => !liked.has(p.id) && !passed.has(p.id))
  const current    = activeDeck[0] ?? null
  const next1      = activeDeck[1] ?? null
  const next2      = activeDeck[2] ?? null

  const doAction = useCallback((action: 'like' | 'pass') => {
    if (!current || animating) return
    setAnimating(action)
    setTimeout(() => {
      if (action === 'like') setLiked(s => new Set([...s, current.id]))
      else setPassed(s => new Set([...s, current.id]))
      setAnimating(null)
    }, 220)
  }, [current, animating])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') doAction('like')
      if (e.key === 'ArrowLeft')  doAction('pass')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doAction])

  if (!intent) return <IntentPicker onPick={setIntent} />

  const locationLabel = city ?? state ?? country ?? 'Everywhere'

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <VerificationBanner />

      {/* Top bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(INTENT_LABELS).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setIntent(id)}
            style={{
              padding: '8px 20px', borderRadius: 9999, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              background: intent === id ? INTENT_COLORS[id] : 'var(--surface)',
              color: intent === id ? 'white' : 'var(--fg-2)',
              border: `1px solid ${intent === id ? INTENT_COLORS[id] : 'var(--border)'}`,
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setIntent(null)}
          style={{ padding: '8px 14px', borderRadius: 9999, background: 'transparent', border: '1px solid var(--border)', fontSize: 13, color: 'var(--fg-3)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Change
        </button>
        <button
          onClick={() => setShowFilters(f => !f)}
          style={{
            padding: '8px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            background: showFilters ? 'var(--primary)' : 'var(--surface)',
            color: showFilters ? 'white' : 'var(--fg-2)',
            border: `1px solid ${showFilters ? 'var(--primary)' : 'var(--border)'}`,
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}
        >
          <SlidersHorizontal size={14} strokeWidth={1.8} />
          Filters
          {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <Link
          href="/connect/setup"
          style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: 9999,
            background: 'var(--primary)', color: 'white',
            fontWeight: 600, fontSize: 13, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <UserCircle2 size={15} strokeWidth={1.5} /> My profile
        </Link>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="np-card" style={{ padding: 20, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Show me</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GENDERS.map(g => (
                <button key={g.value} onClick={() => setGenderFilter(g.value)} style={{
                  padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${genderFilter === g.value ? 'var(--primary)' : 'var(--border)'}`,
                  background: genderFilter === g.value ? 'var(--primary)' : 'var(--surface)',
                  color: genderFilter === g.value ? 'white' : 'var(--fg-2)',
                }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Age: {minAge}–{maxAge}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
                <span style={{ width: 24 }}>Min</span>
                <input type="range" min={18} max={70} value={minAge} onChange={e => setMinAge(Math.min(+e.target.value, maxAge - 1))} style={{ flex: 1, accentColor: 'var(--primary)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
                <span style={{ width: 24 }}>Max</span>
                <input type="range" min={19} max={70} value={maxAge} onChange={e => setMaxAge(Math.max(+e.target.value, minAge + 1))} style={{ flex: 1, accentColor: 'var(--primary)' }} />
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Religion</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <button onClick={() => setReligionFilter('')} style={{
                padding: '5px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: `1.5px solid ${religionFilter === '' ? 'var(--primary)' : 'var(--border)'}`,
                background: religionFilter === '' ? 'var(--primary)' : 'var(--surface)',
                color: religionFilter === '' ? 'white' : 'var(--fg-2)',
              }}>Any</button>
              {RELIGIONS.map(r => (
                <button key={r} onClick={() => setReligionFilter(religionFilter === r ? '' : r)} style={{
                  padding: '5px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${religionFilter === r ? 'var(--primary)' : 'var(--border)'}`,
                  background: religionFilter === r ? 'var(--primary)' : 'var(--surface)',
                  color: religionFilter === r ? 'white' : 'var(--fg-2)',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main layout: card stack + stats sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

        {/* Card stack */}
        <div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--fg-1)' }}>{INTENT_LABELS[intent]}</span>
            <span>·</span>
            <span>{locationLabel}</span>
            {!loading && (
              <>
                <span>·</span>
                <span>{activeDeck.length} profiles</span>
              </>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg-3)' }}>Loading profiles…</div>
          ) : activeDeck.length === 0 ? (
            <div className="np-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {liked.size > 0 ? '🎉' : '🌏'}
              </div>
              <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
                {liked.size > 0 ? `You liked ${liked.size} profile${liked.size > 1 ? 's' : ''}!` : 'No profiles yet'}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 20px' }}>
                {liked.size > 0 ? 'Check back later for new members.' : 'Be the first — create your profile.'}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {(liked.size > 0 || passed.size > 0) && (
                  <button
                    onClick={() => { setLiked(new Set()); setPassed(new Set()) }}
                    style={{ padding: '10px 20px', borderRadius: 9999, background: 'var(--surface)', border: '1.5px solid var(--border)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <RefreshCw size={14} /> Start over
                  </button>
                )}
                <Link href="/connect/setup" style={{ padding: '10px 20px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Create my profile
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Card stack visual */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                {/* Background cards */}
                {next2 && (
                  <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%) scale(0.92)', width: '92%', opacity: 0.4, pointerEvents: 'none', zIndex: 1 }}>
                    <div style={{ borderRadius: 24, height: 60, background: INTENT_GRADIENTS[next2.intent] ?? '#F3F4F6' }} />
                  </div>
                )}
                {next1 && (
                  <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%) scale(0.96)', width: '96%', opacity: 0.6, pointerEvents: 'none', zIndex: 2 }}>
                    <div style={{ borderRadius: 24, height: 60, background: INTENT_GRADIENTS[next1.intent] ?? '#F3F4F6' }} />
                  </div>
                )}
                {/* Current card */}
                <div style={{ position: 'relative', zIndex: 3 }}>
                  <ProfileCard profile={current} animating={animating} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <button
                  onClick={() => doAction('pass')}
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'white', border: '2px solid #FDA4AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.15)',
                    transition: 'transform 120ms, box-shadow 120ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <X size={26} strokeWidth={2.5} style={{ color: '#EF4444' }} />
                </button>

                <span style={{ fontSize: 13, color: 'var(--fg-4)', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
                  {activeDeck.length} left
                </span>

                <button
                  onClick={() => doAction('like')}
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'white', border: '2px solid #86EFAC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(34,197,94,0.15)',
                    transition: 'transform 120ms, box-shadow 120ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <Heart size={26} strokeWidth={2} style={{ color: '#22C55E' }} />
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-4)', marginTop: 10 }}>
                ← pass · like →  (or use arrow keys)
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Session stats */}
          <div className="np-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Your session
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ textAlign: 'center', padding: '12px 0', background: '#FFF0F0', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#EF4444' }}>{passed.size}</div>
                <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Passed</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px 0', background: '#F0FFF4', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#22C55E' }}>{liked.size}</div>
                <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>Liked</div>
              </div>
            </div>
          </div>

          {/* Profile prompt */}
          <div className="np-card" style={{ padding: 18, background: 'var(--primary-50, #EFF6FF)', border: '1px solid var(--primary)30' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)', marginBottom: 6 }}>
              Your profile
            </div>
            <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '0 0 12px', lineHeight: 1.5 }}>
              {myProfileUserId ? 'Your profile is live.' : 'Complete your profile so others can find you.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myProfileUserId && (
                <Link href={`/connect/${myProfileUserId}`} style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  View my profile
                </Link>
              )}
              <Link href="/connect/setup" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9999, background: myProfileUserId ? 'transparent' : 'var(--primary)', color: myProfileUserId ? 'var(--primary)' : 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none', border: `1.5px solid var(--primary)` }}>
                {myProfileUserId ? 'Edit profile' : 'Create profile'}
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="np-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Tips
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              <li>Use GeoBar above to filter by city</li>
              <li>← → arrow keys to pass/like</li>
              <li>Click a card to see full profile</li>
              <li>Hit "Start over" to see passed profiles again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
