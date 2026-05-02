import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'
import { z } from 'zod'

const RoomSchema = z.object({
  title:         z.string().min(5).max(200),
  description:   z.string().min(10),
  price:         z.number().int().positive(),
  type:          z.enum(['PRIVATE', 'SHARED', 'STUDIO', 'ENTIRE_APT']),
  genderPref:    z.enum(['ANY', 'FEMALE', 'MALE', 'MIXED']).default('ANY'),
  city:          z.string(),
  state:         z.string().default(''),
  country:       z.string().default('USA'),
  area:          z.string().optional(),
  availableFrom: z.string(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country  = searchParams.get('country')
  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const type     = searchParams.get('type')
  const gender   = searchParams.get('gender')
  const verified = searchParams.get('verified')

  const geoWhere = buildGeoWhere(country, state, city)

  const rooms = await prisma.room.findMany({
    where: {
      ...geoWhere,
      isAvailable: true,
      ...(minPrice  ? { price: { gte: parseInt(minPrice) } } : {}),
      ...(maxPrice  ? { price: { lte: parseInt(maxPrice) } } : {}),
      ...(type && type !== 'Any'   ? { type:       type.toUpperCase() as any }   : {}),
      ...(gender && gender !== 'Any' ? { genderPref: gender.toUpperCase() as any } : {}),
      ...(verified === 'true' ? { isVerifiedHost: true } : {}),
    },
    include: { host: { select: { id: true, name: true, image: true, isVerified: true } } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  })

  return NextResponse.json(rooms)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = RoomSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const room = await prisma.room.create({
    data: {
      ...parsed.data,
      availableFrom: new Date(parsed.data.availableFrom),
      hostId: (session.user as any).id,
    },
  })

  return NextResponse.json(room, { status: 201 })
}
