import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'

export async function GET(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id as string | undefined

  const { searchParams } = new URL(req.url)
  const country  = searchParams.get('country')
  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const intent   = searchParams.get('intent')

  const geoWhere = buildGeoWhere(country, state, city)

  const myPrefs = myUserId
    ? await prisma.connectProfile.findUnique({
        where: { userId: myUserId },
        select: { prefGender: true, prefMinAge: true, prefMaxAge: true },
      })
    : null

  const ageWhere: { gte?: number; lte?: number } = {}
  if (myPrefs?.prefMinAge != null) ageWhere.gte = myPrefs.prefMinAge
  if (myPrefs?.prefMaxAge != null) ageWhere.lte = myPrefs.prefMaxAge

  const profiles = await prisma.connectProfile.findMany({
    where: {
      isVisible: true,
      ...(myUserId ? { NOT: { userId: myUserId } } : {}),
      ...geoWhere,
      ...(intent ? { OR: [{ intents: { hasSome: [intent] } }, { intents: { isEmpty: true } }] } : {}),
      ...(myPrefs?.prefGender ? { gender: myPrefs.prefGender } : {}),
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
