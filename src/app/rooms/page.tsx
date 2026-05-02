import { RoomsFilters } from '@/components/rooms/RoomsFilters'
import { RoomCard } from '@/components/rooms/RoomCard'
import { RoomsRightRail } from '@/components/rooms/RoomsRightRail'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere, getLocationLabel } from '@/lib/geo'

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{
    country?: string
    state?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    type?: string
    gender?: string
    verified?: string
  }>
}) {
  const params  = await searchParams
  const country = params.country
  const state   = params.state
  const city    = params.city
  const geoLabel = getLocationLabel(country, state, city)
  const geoWhere = buildGeoWhere(country, state, city)

  let rooms: any[] = []
  try {
    rooms = await prisma.room.findMany({
      where: {
        ...geoWhere,
        isAvailable: true,
        ...(params.minPrice ? { price: { gte: parseInt(params.minPrice) } } : {}),
        ...(params.maxPrice ? { price: { lte: parseInt(params.maxPrice) } } : {}),
        ...(params.type && params.type !== 'Any' ? { type: params.type.toUpperCase() as any } : {}),
        ...(params.gender && params.gender !== 'Any' ? { genderPref: params.gender.toUpperCase() as any } : {}),
        ...(params.verified === 'true' ? { isVerifiedHost: true } : {}),
      },
      include: {
        host: { select: { id: true, name: true, image: true, isVerified: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    })
  } catch {
    // DB not connected
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px',
      display: 'grid',
      gridTemplateColumns: '260px 1fr 280px',
      gap: 24,
      alignItems: 'start',
    }}>
      <div style={{ position: 'sticky', top: 120 }}>
        <RoomsFilters city={city ?? ''} country={country} state={state} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--fg-1)' }}>
            Rooms · {geoLabel}
          </h1>
          <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>{rooms.length} listings</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rooms.length === 0 ? (
            <div className="np-card np-empty">
              <h3>No rooms for {geoLabel} right now.</h3>
              <p style={{ fontSize: 14, marginTop: 4 }}>Set an alert and we'll let you know.</p>
            </div>
          ) : (
            rooms.map((room: any) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
      </div>

      <div style={{ position: 'sticky', top: 120 }}>
        <RoomsRightRail city={city ?? 'Dallas'} />
      </div>
    </div>
  )
}
