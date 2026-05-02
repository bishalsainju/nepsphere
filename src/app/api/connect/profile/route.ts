import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await req.json()

  const {
    intent, gender, lookingFor, age, height, bio, language, caste,
    religion, hometown, occupation, education, drinking, smoking,
    dietary, city, state, country,
  } = body

  if (!intent || !bio) {
    return NextResponse.json({ error: 'intent and bio are required' }, { status: 400 })
  }

  const userId = (session?.user as any)?.id
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to save your profile' }, { status: 401 })
  }

  const data = {
    intent,
    gender,
    lookingFor:  lookingFor  ?? [],
    age,
    height,
    bio,
    language:    language    ?? [],
    caste,
    religion,
    hometown,
    occupation,
    education,
    drinking,
    smoking,
    dietary,
    city:    city    ?? 'Dallas',
    state:   state   ?? 'Texas',
    country: country ?? 'USA',
  }

  const profile = await prisma.connectProfile.upsert({
    where: { userId },
    create: { userId, isVisible: true, ...data },
    update: data,
  })

  return NextResponse.json(profile)
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json(null)

  const profile = await prisma.connectProfile.findUnique({ where: { userId } })
  return NextResponse.json(profile ?? null)
}
