import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Sign in to save your profile' }, { status: 401 })
    }

    const body = await req.json()

    const {
      intents, gender, lookingFor, age, height, bio, language, caste,
      religion, hometown, occupation, education, drinking, smoking,
      dietary, city, state, country, prefGender, prefMinAge, prefMaxAge,
    } = body

    if (!Array.isArray(intents) || intents.length === 0 || !bio?.trim()) {
      return NextResponse.json({ error: 'At least one intent and bio are required' }, { status: 400 })
    }

    const data = {
      intents: intents.filter(Boolean),
      gender:      gender      ?? null,
      lookingFor:  Array.isArray(lookingFor)  ? lookingFor  : [],
      age:         typeof age === 'number'    ? age         : null,
      height:      height      ?? null,
      bio:         bio.trim(),
      language:    Array.isArray(language)    ? language    : [],
      caste:       caste       || null,
      religion:    religion    ?? null,
      hometown:    hometown    ?? null,
      occupation:  occupation  ?? null,
      education:   education   ?? null,
      drinking:    drinking    ?? null,
      smoking:     smoking     ?? null,
      dietary:     dietary     ?? null,
      city:        city        || 'Dallas',
      state:       state       ?? 'Texas',
      country:     country     ?? 'USA',
      prefGender:  prefGender  || null,
      prefMinAge:  typeof prefMinAge === 'number' ? prefMinAge : null,
      prefMaxAge:  typeof prefMaxAge === 'number' ? prefMaxAge : null,
    }

    const profile = await prisma.connectProfile.upsert({
      where:  { userId },
      create: { userId, isVisible: true, photos: [], ...data },
      update: data,
    })

    return NextResponse.json(profile)
  } catch (err: any) {
    console.error('[connect/profile POST]', err)
    return NextResponse.json(
      { error: err?.message ?? 'Failed to save profile' },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) return NextResponse.json(null)

    const profile = await prisma.connectProfile.findUnique({ where: { userId } })
    return NextResponse.json(profile ?? null)
  } catch (err: any) {
    console.error('[connect/profile GET]', err)
    return NextResponse.json(null)
  }
}
