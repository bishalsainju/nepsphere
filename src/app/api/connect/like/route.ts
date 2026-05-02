import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST — record a like, return whether it's a mutual match
export async function POST(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id
  if (!myUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toUserId } = await req.json()
  if (!toUserId) return NextResponse.json({ error: 'toUserId required' }, { status: 400 })

  await prisma.connectLike.upsert({
    where: { fromUserId_toUserId: { fromUserId: myUserId, toUserId } },
    create: { fromUserId: myUserId, toUserId },
    update: {},
  })

  // Check for mutual like (match)
  const mutual = await prisma.connectLike.findUnique({
    where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: myUserId } },
  })

  return NextResponse.json({ isMatch: !!mutual })
}

// GET — return stats: how many liked me, how many mutual matches
export async function GET(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id
  if (!myUserId) return NextResponse.json({ receivedLikes: 0, matches: 0 })

  const [receivedLikes, sentLikes] = await Promise.all([
    prisma.connectLike.findMany({ where: { toUserId: myUserId }, select: { fromUserId: true } }),
    prisma.connectLike.findMany({ where: { fromUserId: myUserId }, select: { toUserId: true } }),
  ])

  const sentSet = new Set(sentLikes.map(l => l.toUserId))
  const matches = receivedLikes.filter(l => sentSet.has(l.fromUserId)).length

  return NextResponse.json({ receivedLikes: receivedLikes.length, matches })
}
