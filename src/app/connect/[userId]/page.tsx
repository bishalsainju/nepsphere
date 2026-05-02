import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--fg-1)', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

export default async function ConnectProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  const profile = await prisma.connectProfile.findFirst({
    where: { userId, isVisible: true },
    include: { user: { select: { id: true, name: true, image: true, isVerified: true, city: true } } },
  }).catch(() => null)

  if (!profile) notFound()

  const color    = INTENT_COLORS[profile.intent]  ?? '#6B7280'
  const gradient = INTENT_GRADIENTS[profile.intent] ?? 'linear-gradient(160deg,#F3F4F6,#FFFFFF)'
  const genderLabel = profile.gender ? GENDER_LABELS[profile.gender as string] ?? profile.gender : null

  const details: { label: string; value: string }[] = [
    profile.age       ? { label: 'Age',       value: `${profile.age} years old` } : null,
    genderLabel       ? { label: 'Gender',    value: genderLabel }                : null,
    profile.height    ? { label: 'Height',    value: profile.height as string }   : null,
    profile.hometown  ? { label: 'Hometown',  value: `🇳🇵 ${profile.hometown}` }   : null,
    profile.religion  ? { label: 'Religion',  value: profile.religion as string } : null,
    profile.caste     ? { label: 'Community', value: profile.caste as string }    : null,
    profile.occupation? { label: 'Occupation',value: profile.occupation as string}: null,
    profile.education ? { label: 'Education', value: profile.education as string }:null,
    profile.dietary   ? { label: 'Diet',      value: profile.dietary as string }  : null,
    profile.drinking  ? { label: 'Drinking',  value: profile.drinking as string } : null,
    profile.smoking   ? { label: 'Smoking',   value: profile.smoking as string }  : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <Link href="/connect" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Connect
      </Link>

      <div className="np-card" style={{ overflow: 'hidden' }}>
        {/* Banner */}
        <div style={{ height: 200, background: gradient, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, background: color, color: 'white', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 9999 }}>
            {INTENT_LABELS[profile.intent]}
          </div>
          <div style={{ position: 'absolute', left: '50%', bottom: -44, transform: 'translateX(-50%)' }}>
            <Avatar name={profile.user.name ?? 'NS'} size={88} intent={profile.intent.toLowerCase() as any} src={profile.user.image ?? undefined} />
          </div>
        </div>

        {/* Header info */}
        <div style={{ padding: '56px 32px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {profile.user.name ?? 'Nepali member'}
            {profile.user.isVerified && <Badge size={18} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6, color: 'var(--fg-3)', fontSize: 14, flexWrap: 'wrap' }}>
            {profile.age && <span style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{profile.age}</span>}
            {profile.age && genderLabel && <span>·</span>}
            {genderLabel && <span>{genderLabel}</span>}
            {profile.height && <><span>·</span><span>{profile.height as string}</span></>}
            {profile.city && (
              <>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <MapPin size={12} strokeWidth={1.5} />
                  {profile.city}{profile.state ? `, ${profile.state}` : ''}
                </span>
              </>
            )}
          </div>

          {/* Interested in tags */}
          {(profile.lookingFor as string[]).length > 0 && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Looking for:</span>
              {(profile.lookingFor as string[]).map((lf: string) => (
                <span key={lf} style={{ fontSize: 12, fontWeight: 600, background: color + '15', color, border: `1px solid ${color}25`, padding: '3px 10px', borderRadius: 9999 }}>
                  {lf}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{ padding: '20px 32px' }}>
            <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.75, margin: 0, borderLeft: `3px solid ${color}`, paddingLeft: 14 }}>
              {profile.bio as string}
            </p>
          </div>
        )}

        {/* Details grid */}
        {details.length > 0 && (
          <div style={{ margin: '0 24px 24px', background: 'var(--surface)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Profile details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
              {details.map(d => <InfoRow key={d.label} label={d.label} value={d.value} />)}
            </div>
          </div>
        )}

        {/* Languages */}
        {(profile.language as string[]).length > 0 && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(profile.language as string[]).map((l: string) => (
                <span key={l} style={{ fontSize: 13, fontWeight: 600, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 9999, color: 'var(--fg-2)' }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: '0 24px 28px', display: 'flex', justifyContent: 'center' }}>
          <button className="np-btn np-btn-primary lg" style={{ background: color, borderColor: color, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 32px' }}>
            <MessageCircle size={16} strokeWidth={1.5} /> Send message
          </button>
        </div>
      </div>
    </div>
  )
}
