import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  PRIVATE: 'Private room', SHARED: 'Shared room',
  STUDIO: 'Studio', ENTIRE_APT: 'Entire apartment',
}
const GENDER_LABELS: Record<string, string> = {
  ANY: 'Any gender', FEMALE: 'Female only', MALE: 'Male only', MIXED: 'Mixed',
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params

  let room: any = null
  try {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { host: true },
    })
  } catch {
    // DB not connected
  }

  if (!room) notFound()

  const availStr = new Date(room.availableFrom).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Link href="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Rooms
      </Link>

      {/* Photo gallery placeholder */}
      <div style={{
        height: 320,
        borderRadius: 20,
        background: 'linear-gradient(135deg, var(--warm-100), var(--warm-200))',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--fg-4)',
        fontSize: 14,
        gap: 8,
      }}>
        {room.photos.length > 0 ? `${room.photos.length} photos` : 'No photos yet'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)' }}>
              {room.title}
            </h1>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              ${room.price.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)' }}>/mo</span>
            </div>
          </div>

          <div className="np-meta">{room.area ? `${room.area} · ` : ''}{room.city}, {room.state}</div>

          <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
            <span className="np-pill">{TYPE_LABELS[room.type] ?? room.type}</span>
            <span className="np-pill">{GENDER_LABELS[room.genderPref] ?? room.genderPref}</span>
            <span className="np-pill">Available {availStr}</span>
            {room.isVerifiedHost && (
              <span className="np-pill success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={11} strokeWidth={2} /> Verified host
              </span>
            )}
          </div>

          <p style={{ lineHeight: 1.75, color: 'var(--fg-2)', fontSize: 15, whiteSpace: 'pre-wrap' }}>
            {room.description}
          </p>
        </div>

        {/* Contact card */}
        <div>
          <div className="np-card" style={{ padding: 24, position: 'sticky', top: 120 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Avatar name={room.host.name ?? 'NS'} size={48} src={room.host.image ?? undefined} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)' }}>{room.host.name}</div>
                {room.host.isVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--crimson-500)', marginTop: 2 }}>
                    <Badge size={12} /> Verified
                  </div>
                )}
              </div>
            </div>

            <button className="np-btn np-btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, fontSize: 15, padding: '12px 0' }}>
              Contact host
            </button>
            <button className="np-btn np-btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0', fontSize: 14 }}>
              Save listing
            </button>

            <p style={{ fontSize: 12, color: 'var(--fg-4)', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
              Sign in to keep your community safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
