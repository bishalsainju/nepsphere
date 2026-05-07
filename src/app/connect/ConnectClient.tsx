'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IntentPicker } from '@/components/connect/IntentPicker'
import { VerificationBanner } from '@/components/connect/VerificationBanner'
import { UpgradeModal } from '@/components/connect/UpgradeModal'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { UserCircle2, X, Heart, RefreshCw, Zap } from 'lucide-react'

const DAILY_SWIPE_LIMIT = 10

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
  profile, animating, swipeOffset = 0, activeIntent,
}: {
  profile: any
  animating: 'like' | 'pass' | null
  swipeOffset?: number
  activeIntent?: string | null
}) {
  const displayIntent = activeIntent && (profile.intents ?? []).includes(activeIntent)
    ? activeIntent
    : (profile.intents ?? [])[0] ?? 'GENERAL'
  const color    = INTENT_COLORS[displayIntent]  ?? '#6B7280'
  const gradient = INTENT_GRADIENTS[displayIntent] ?? 'linear-gradient(160deg,#F3F4F6,#FFFFFF)'
  const genderLabel = profile.gender ? GENDER_LABELS[profile.gender] ?? profile.gender : null

  const isDragging = !animating && swipeOffset !== 0
  const showLike   = swipeOffset > 30
  const showNope   = swipeOffset < -30

  const transform = animating === 'like'
    ? 'translateX(120px) rotate(12deg) scale(0.97)'
    : animating === 'pass'
    ? 'translateX(-120px) rotate(-12deg) scale(0.97)'
    : isDragging
    ? `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg)`
    : 'none'

  const likeOpacity = Math.min(Math.max((swipeOffset - 30) / 60, 0), 1)
  const nopeOpacity = Math.min(Math.max((-swipeOffset - 30) / 60, 0), 1)

  return (
    <div style={{
      transform,
      opacity: animating ? 0.3 : 1,
      transition: isDragging ? 'none' : 'transform 0.22s ease, opacity 0.22s ease',
      borderRadius: 24,
      overflow: 'hidden',
      background: 'var(--surface)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.13)',
      width: '100%',
      position: 'relative',
      userSelect: 'none',
    }}>
      {/* LIKE stamp */}
      {showLike && (
        <div style={{
          position: 'absolute', top: 28, left: 20, zIndex: 10,
          border: '3px solid #22C55E', borderRadius: 8,
          padding: '4px 14px', transform: 'rotate(-14deg)',
          fontSize: 22, fontWeight: 900, color: '#22C55E',
          opacity: likeOpacity, pointerEvents: 'none',
        }}>LIKE</div>
      )}
      {/* NOPE stamp */}
      {showNope && (
        <div style={{
          position: 'absolute', top: 28, right: 20, zIndex: 10,
          border: '3px solid #EF4444', borderRadius: 8,
          padding: '4px 14px', transform: 'rotate(14deg)',
          fontSize: 22, fontWeight: 900, color: '#EF4444',
          opacity: nopeOpacity, pointerEvents: 'none',
        }}>NOPE</div>
      )}
      {/* Banner */}
      <div style={{ height: 200, background: gradient, position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(profile.intents ?? []).map((intId: string) => (
            <span key={intId} style={{
              background: INTENT_COLORS[intId] ?? '#6B7280', color: 'white',
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 9999,
            }}>
              {INTENT_LABELS[intId] ?? intId}
            </span>
          ))}
        </div>
        <div style={{ position: 'absolute', left: '50%', bottom: -44, transform: 'translateX(-50%)' }}>
          <Avatar name={profile.user.name ?? 'NS'} size={88} intent={displayIntent.toLowerCase() as any} src={profile.user.image ?? undefined} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '56px 24px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {profile.user.name ?? 'Nepali member'}
          {profile.user.isVerified && <Badge size={16} />}
        </div>

        <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          {profile.age && <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{profile.age}</span>}
          {profile.age && genderLabel && <span>·</span>}
          {genderLabel && <span>{genderLabel}</span>}
          {profile.height && <><span>·</span><span>{profile.height}</span></>}
          {profile.city && <><span>·</span><span>{profile.city}{profile.state ? `, ${profile.state.slice(0,2)}` : ''}</span></>}
        </div>

        {profile.bio && (
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.65, margin: '14px 0 10px', textAlign: 'left' }}>
            {profile.bio.length > 200 ? profile.bio.slice(0, 200) + '…' : profile.bio}
          </p>
        )}

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

        {(profile.dietary || profile.drinking || profile.smoking) && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap', fontSize: 12, color: 'var(--fg-3)' }}>
            {profile.dietary   && <span>🍽 {profile.dietary}</span>}
            {profile.drinking  && <span>🥂 {profile.drinking}</span>}
            {profile.smoking === 'Never' && <span>🚭 Non-smoker</span>}
            {profile.smoking && profile.smoking !== 'Never' && <span>🚬 {profile.smoking}</span>}
          </div>
        )}

        {profile.language?.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-4)' }}>
            🗣 {profile.language.join(' · ')}
          </div>
        )}

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

function UpgradeWall({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div style={{
      borderRadius: 24, overflow: 'hidden',
      background: 'var(--surface)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.13)',
      width: '100%',
      textAlign: 'center',
      padding: '48px 28px 40px',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Zap size={30} style={{ color: 'white' }} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: '0 0 10px', color: 'var(--fg-1)' }}>
        You&apos;re out of free swipes
      </h3>
      <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 28px', lineHeight: 1.65 }}>
        Free accounts get <strong>10 swipes per day</strong>. Come back tomorrow, or upgrade for unlimited swipes and messaging.
      </p>
      <button
        onClick={onUpgrade}
        style={{
          padding: '13px 36px', borderRadius: 9999, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
          color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
          boxShadow: '0 4px 20px rgba(227,28,95,0.35)',
        }}
      >
        Upgrade to Premium
      </button>
      <p style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 14 }}>
        Free swipes reset daily at midnight UTC
      </p>
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
  const [deck, setDeck]   = useState<any[]>([])
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [passed, setPassed] = useState<Set<string>>(new Set())
  const [animating, setAnimating] = useState<'like' | 'pass' | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const [myProfileUserId, setMyProfileUserId] = useState<string | null | undefined>(undefined)
  const [matchCount,    setMatchCount]    = useState(0)
  const [receivedLikes, setReceivedLikes] = useState(0)

  // Freemium state
  const [isPremium,       setIsPremium]       = useState(false)
  const [swipesUsed,      setSwipesUsed]      = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const swipesRemaining = isPremium ? Infinity : Math.max(0, DAILY_SWIPE_LIMIT - swipesUsed)
  const limitReached    = !isPremium && swipesUsed >= DAILY_SWIPE_LIMIT
  const needsProfile    = myProfileUserId === null
  const swipeBlocked    = needsProfile || limitReached

  useEffect(() => {
    fetch('/api/connect/profile')
      .then(r => r.ok ? r.json() : null)
      .then(p => {
        setMyProfileUserId(p?.userId ?? null)
        if (p?.intents?.length > 0 && !intent) {
          setIntent(p.intents[0])
        }
        if (p?.userId) {
          fetch('/api/connect/like')
            .then(r => r.json())
            .then(d => {
              setMatchCount(d.matches ?? 0)
              setReceivedLikes(d.receivedLikes ?? 0)
              setSwipesUsed(d.swipesUsed ?? 0)
              setIsPremium(d.isPremium ?? false)
            })
            .catch(() => {})
        }
      })
      .catch(() => setMyProfileUserId(null))
  }, [])

  useEffect(() => {
    if (!intent) return
    setLoading(true)
    setIdx(0)
    setLiked(new Set())
    setPassed(new Set())

    const params = new URLSearchParams()
    params.set('intent', intent)
    if (country) params.set('country', country)
    if (state)   params.set('state', state)
    if (city)    params.set('city', city)

    fetch(`/api/connect?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setProfiles(Array.isArray(data) ? data : []); setDeck(Array.isArray(data) ? data : []) })
      .catch(() => { setProfiles([]); setDeck([]) })
      .finally(() => setLoading(false))
  }, [intent, country, state, city, myProfileUserId])

  const [idx, setIdx] = useState(0)

  const activeDeck = deck.filter(p => !liked.has(p.id) && !passed.has(p.id))
  const current    = activeDeck[0] ?? null
  const next1      = activeDeck[1] ?? null
  const next2      = activeDeck[2] ?? null

  const doAction = useCallback((action: 'like' | 'pass') => {
    if (!current || animating) return

    if (myProfileUserId === null) {
      window.location.href = '/connect/setup'
      return
    }

    if (limitReached) {
      setShowUpgradeModal(true)
      return
    }

    setAnimating(action)
    const profileId = current.id
    const userId    = current.userId

    setTimeout(() => {
      if (action === 'like') {
        setLiked(s => new Set([...s, profileId]))
      } else {
        setPassed(s => new Set([...s, profileId]))
      }
      setAnimating(null)
    }, 220)

    fetch('/api/connect/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: userId, action }),
    }).then(r => r.json()).then(d => {
      if (d.profileRequired) {
        window.location.href = '/connect/setup'
        return
      }
      if (d.limitReached) {
        setSwipesUsed(DAILY_SWIPE_LIMIT)
        setShowUpgradeModal(true)
        return
      }
      setSwipesUsed(d.swipesUsed ?? swipesUsed + 1)
      if (action === 'like' && d.isMatch) setMatchCount(c => c + 1)
    }).catch(() => {})
  }, [current, animating, limitReached, swipesUsed, myProfileUserId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') doAction('like')
      if (e.key === 'ArrowLeft')  doAction('pass')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doAction])

  const SWIPE_THRESHOLD = 80

  function handleTouchStart(e: React.TouchEvent) {
    if (animating || !current || swipeBlocked) return
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || animating || swipeBlocked) return
    const dx = e.touches[0].clientX - touchStartX.current
    setSwipeOffset(dx)
    if (Math.abs(dx) > 8) e.preventDefault()
  }

  function handleTouchEnd() {
    if (touchStartX.current === null) return
    const offset = swipeOffset
    setSwipeOffset(0)
    touchStartX.current = null
    if (Math.abs(offset) >= SWIPE_THRESHOLD) {
      doAction(offset > 0 ? 'like' : 'pass')
    }
  }

  if (!intent) return <IntentPicker onPick={setIntent} />

  const locationLabel = city ?? state ?? country ?? 'Everywhere'

  return (
    <div className="np-page-wrap" style={{ maxWidth: 1100 }}>
      {showUpgradeModal && (
        <UpgradeModal reason="swipes" onClose={() => setShowUpgradeModal(false)} />
      )}

      <VerificationBanner />

      {/* Top bar */}
      <div className="np-connect-topbar" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <Link
          href={myProfileUserId ? '/profile?tab=connect' : '/connect/setup'}
          style={{
            marginLeft: 'auto', padding: '8px 18px', borderRadius: 9999,
            background: 'var(--primary)', color: 'white',
            fontWeight: 600, fontSize: 13, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <UserCircle2 size={15} strokeWidth={1.5} />
          {myProfileUserId ? 'My profile' : 'Create profile'}
        </Link>
      </div>

      {/* Main layout: card stack + stats sidebar */}
      <div className="np-2col-right">

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

          {needsProfile && (
            <div style={{
              padding: '14px 16px', borderRadius: 14, marginBottom: 16,
              background: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
              border: '1px solid #FECDD3',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: 22 }}>💕</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-1)' }}>Create your profile to start swiping</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>Browse freely — like and pass unlock once your profile is live.</div>
              </div>
              <Link href="/connect/setup" style={{
                padding: '8px 18px', borderRadius: 9999,
                background: 'var(--primary)', color: 'white',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}>
                Create profile
              </Link>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg-3)' }}>Loading profiles…</div>
          ) : limitReached && activeDeck.length > 0 ? (
            <UpgradeWall onUpgrade={() => setShowUpgradeModal(true)} />
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
                {next2 && (
                  <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%) scale(0.92)', width: '92%', opacity: 0.4, pointerEvents: 'none', zIndex: 1 }}>
                    <div style={{ borderRadius: 24, height: 60, background: INTENT_GRADIENTS[(next2.intents ?? [])[0]] ?? '#F3F4F6' }} />
                  </div>
                )}
                {next1 && (
                  <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%) scale(0.96)', width: '96%', opacity: 0.6, pointerEvents: 'none', zIndex: 2 }}>
                    <div style={{ borderRadius: 24, height: 60, background: INTENT_GRADIENTS[(next1.intents ?? [])[0]] ?? '#F3F4F6' }} />
                  </div>
                )}
                <div
                  style={{ position: 'relative', zIndex: 3, touchAction: 'pan-y' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <ProfileCard profile={current} animating={animating} swipeOffset={swipeOffset} activeIntent={intent} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <button
                  onClick={() => doAction('pass')}
                  disabled={swipeBlocked}
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'white', border: '2px solid #FDA4AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: swipeBlocked ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.15)',
                    opacity: swipeBlocked ? 0.4 : 1,
                    transition: 'transform 120ms, box-shadow 120ms',
                  }}
                  onMouseEnter={e => { if (!swipeBlocked) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <X size={26} strokeWidth={2.5} style={{ color: '#EF4444' }} />
                </button>

                <span style={{ fontSize: 13, color: 'var(--fg-4)', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
                  {activeDeck.length} left
                </span>

                <button
                  onClick={() => doAction('like')}
                  disabled={swipeBlocked}
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'white', border: '2px solid #86EFAC',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: swipeBlocked ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(34,197,94,0.15)',
                    opacity: swipeBlocked ? 0.4 : 1,
                    transition: 'transform 120ms, box-shadow 120ms',
                  }}
                  onMouseEnter={e => { if (!swipeBlocked) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <Heart size={26} strokeWidth={2} style={{ color: '#22C55E' }} />
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-4)', marginTop: 10 }}>
                Swipe left to pass · swipe right to like
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Your profile */}
          <div className="np-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Your profile
            </div>
            {myProfileUserId === undefined ? (
              <div style={{ fontSize: 13, color: 'var(--fg-4)', textAlign: 'center', padding: '8px 0' }}>Loading…</div>
            ) : myProfileUserId ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', background: '#F0FFF4', borderRadius: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#15803D', fontWeight: 600 }}>Your profile is live</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/profile?tab=connect" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                    View my profile
                  </Link>
                  <Link href="/connect/edit" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9999, background: 'transparent', color: 'var(--primary)', fontWeight: 600, fontSize: 13, textDecoration: 'none', border: '1.5px solid var(--primary)' }}>
                    Edit profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: '0 0 12px', lineHeight: 1.5 }}>
                  Complete your profile so others can find you.
                </p>
                <Link href="/connect/setup" style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  Create profile
                </Link>
              </>
            )}
          </div>

          {/* Swipe counter */}
          <div className="np-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Daily swipes
            </div>
            {isPremium ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#FFF0F6', borderRadius: 10 }}>
                <Zap size={16} style={{ color: '#E31C5F', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E31C5F' }}>Unlimited — Premium</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                    <strong style={{ color: limitReached ? '#EF4444' : 'var(--fg-1)' }}>{swipesUsed}</strong>
                    <span style={{ color: 'var(--fg-4)' }}> / {DAILY_SWIPE_LIMIT}</span>
                  </span>
                  <span style={{ fontSize: 12, color: limitReached ? '#EF4444' : 'var(--fg-4)' }}>
                    {limitReached ? 'Limit reached' : `${swipesRemaining} left`}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, borderRadius: 9999, background: 'var(--border)', overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{
                    height: '100%', borderRadius: 9999,
                    width: `${Math.min((swipesUsed / DAILY_SWIPE_LIMIT) * 100, 100)}%`,
                    background: limitReached
                      ? '#EF4444'
                      : swipesUsed >= 7
                      ? '#F97316'
                      : '#22C55E',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  style={{
                    width: '100%', padding: '9px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #E31C5F, #FF6B9D)',
                    color: 'white', fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Zap size={13} /> Upgrade for unlimited
                </button>
              </>
            )}
          </div>

          {/* Match stats */}
          {myProfileUserId && (
            <div className="np-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                Your matches
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div style={{ textAlign: 'center', padding: '12px 0', background: '#FFF0F9', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#E31C5F' }}>{matchCount}</div>
                  <div style={{ fontSize: 11, color: '#E31C5F', fontWeight: 600 }}>Matches</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 0', background: '#FFF7ED', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#EA580C' }}>{receivedLikes}</div>
                  <div style={{ fontSize: 11, color: '#EA580C', fontWeight: 600 }}>Liked you</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ textAlign: 'center', padding: '10px 0', background: '#FFF0F0', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#EF4444' }}>{passed.size}</div>
                  <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Passed</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0', background: '#F0FFF4', borderRadius: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#22C55E' }}>{liked.size}</div>
                  <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>Liked</div>
                </div>
              </div>
            </div>
          )}

          {/* Session stats (no profile) */}
          {!myProfileUserId && (
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
          )}

          {/* Tips */}
          <div className="np-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Tips
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.8 }}>
              <li>Use GeoBar above to change city</li>
              <li>← → arrow keys to pass/like</li>
              <li>Click a card to see full profile</li>
              <li>Edit your profile to change who you see</li>
              <li>Hit "Start over" to see passed profiles again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
