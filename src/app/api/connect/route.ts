import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country  = searchParams.get('country')
  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const intent   = searchParams.get('intent')
  const gender   = searchParams.get('gender')
  const minAge   = searchParams.get('minAge')
  const maxAge   = searchParams.get('maxAge')
  const religion = searchParams.get('religion')
  const caste    = searchParams.get('caste')

  const geoWhere = buildGeoWhere(country, state, city)

  let ageWhere: any = {}
  if (minAge) ageWhere.gte = parseInt(minAge)
  if (maxAge) ageWhere.lte = parseInt(maxAge)

  const profiles = await prisma.connectProfile.findMany({
    where: {
      isVisible: true,
      ...geoWhere,
      ...(intent   ? { intent: intent as any } : {}),
      ...(gender   ? { gender } : {}),
      ...(religion ? { religion } : {}),
      ...(caste    ? { caste }    : {}),
      ...(Object.keys(ageWhere).length ? { age: ageWhere } : {}),
    },
    include: {
      user: { select: { id: true, name: true, image: true, isVerified: true, city: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(profiles)
}
