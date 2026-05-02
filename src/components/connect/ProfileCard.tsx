'use client'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

const INTENT_COLORS: Record<string, string> = {
  FRIENDSHIP: '#3B82F6',
  DATING:     '#E31C5F',
  MARRIAGE:   '#0E9F6E',
}

const INTENT_LABELS: Record<string, string> = {
  FRIENDSHIP: 'Friendship',
  DATING:     'Dating',
  MARRIAGE:   'Marriage',
}

const INTENT_GRADIENTS: Record<string, string> = {
  FRIENDSHIP: 'linear-gradient(135deg, #BFDBFE, #EFF6FF)',
  DATING:     'linear-gradient(135deg, #FECDD3, #FFF1F2)',
  MARRIAGE:   'linear-gradient(135deg, #A7F3D0, #ECFDF5)',
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Man', FEMALE: 'Woman', NON_BINARY: 'Non-binary', OTHER: 'Other',
}

type AvatarIntent = 'friendship' | 'dating' | 'marriage' | 'default'

export function ProfileCard({
  profile,
}: {
  profile: {
    id: string
    intent: string
    bio: string | null
    age: number | null
    height: string | null
    gender: string | null
    lookingFor: string[] | null
    city: string
    user: { id: string; name: string | null; image: string | null; isVerified: boolean; city: string | null }
  }
}) {
  const color = INTENT_COLORS[profile.intent] ?? '#6B7280'
  const gradient = INTENT_GRADIENTS[profile.intent] ?? 'linear-gradient(135deg, #F3F4F6, #FFFFFF)'
  const intentLabel = INTENT_LABELS[profile.intent] ?? profile.intent
  const avatarIntent = profile.intent.toLowerCase() as AvatarIntent
  const genderLabel = profile.gender ? GENDER_LABELS[profile.gender] ?? profile.gender : null

  return (
    <Link href={`/connect/${profile.user.id}`} style={{ textDecoration: 'none' }}>
    <article className="np-card interactive" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
      <div style={{ height: 100, background: gradient, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: color, color: 'white',
          fontSize: 11, fontWeight: 700,
          padding: '4px 10px', borderRadius: 9999,
        }}>
          {intentLabel}
        </div>
        <div style={{ position: 'absolute', left: '50%', bottom: -28, transform: 'translateX(-50%)' }}>
          <Avatar name={profile.user.name ?? 'NS'} size={56} intent={avatarIntent} src={profile.user.image ?? undefined} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '36px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {profile.user.name ?? 'Nepali member'}
          {profile.user.isVerified && <Badge size={14} />}
        </div>

        {/* Age · Gender · Height */}
        <div className="np-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          {profile.age && <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{profile.age}</span>}
          {profile.age && genderLabel && <span>·</span>}
          {genderLabel && <span>{genderLabel}</span>}
          {profile.height && <><span>·</span><span>{profile.height}</span></>}
        </div>

        <div className="np-meta">{profile.city}</div>

        {profile.bio && (
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5, minHeight: 32 }}>
            {profile.bio.length > 90 ? profile.bio.slice(0, 90) + '…' : profile.bio}
          </p>
        )}

        {/* Looking for tags */}
        {(profile.lookingFor ?? []).length > 0 && (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginTop: 6 }}>
            {(profile.lookingFor ?? []).map(lf => (
              <span key={lf} style={{
                fontSize: 10, fontWeight: 600,
                background: color + '15', color, border: `1px solid ${color}30`,
                padding: '2px 8px', borderRadius: 9999,
              }}>
                {lf}
              </span>
            ))}
          </div>
        )}

        <button
          className="np-btn np-btn-primary sm"
          style={{ marginTop: 10, alignSelf: 'center', background: color, borderColor: color }}
          onClick={e => e.preventDefault()}
        >
          View profile
        </button>
      </div>
    </article>
    </Link>
  )
}
