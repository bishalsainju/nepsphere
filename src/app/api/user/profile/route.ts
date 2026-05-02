import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, bio, city, state, country } = body

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name    !== undefined && { name:    name?.trim()    || null }),
      ...(bio     !== undefined && { bio:     bio?.trim()     || null }),
      ...(city    !== undefined && { city:    city?.trim()    || null }),
      ...(state   !== undefined && { state:   state?.trim()   || null }),
      ...(country !== undefined && { country: country?.trim() || null }),
    },
    select: { id: true, name: true, bio: true, city: true, state: true, country: true },
  })

  return NextResponse.json(updated)
}
