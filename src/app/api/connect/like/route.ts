import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DAILY_SWIPE_LIMIT = 10

function isToday(date: Date | null | undefined): boolean {
  if (!date) return false
  const now = new Date()
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth()    === now.getUTCMonth() &&
    date.getUTCDate()     === now.getUTCDate()
  )
}

// POST — record a swipe (like or pass), enforce daily limit for free users
export async function POST(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id
  if (!myUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toUserId, action } = await req.json() as { toUserId: string; action: 'like' | 'pass' }
  if (!toUserId) return NextResponse.json({ error: 'toUserId required' }, { status: 400 })

  const myProfile = await prisma.connectProfile.findUnique({
    where: { userId: myUserId },
    select: { userId: true },
  })
  if (!myProfile) {
    return NextResponse.json(
      { error: 'Create a Connect profile before swiping', profileRequired: true },
      { status: 403 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: myUserId },
    select: { isPremium: true, dailySwipeCount: true, dailySwipeDate: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Reset count if it's a new day
  const swipeCount = isToday(user.dailySwipeDate) ? user.dailySwipeCount : 0

  if (!user.isPremium && swipeCount >= DAILY_SWIPE_LIMIT) {
    return NextResponse.json({ limitReached: true, swipesUsed: swipeCount, swipesRemaining: 0 })
  }

  const newCount = swipeCount + 1

  await prisma.user.update({
    where: { id: myUserId },
    data: { dailySwipeCount: newCount, dailySwipeDate: new Date() },
  })

  let isMatch = false
  if (action === 'like') {
    await prisma.connectLike.upsert({
      where: { fromUserId_toUserId: { fromUserId: myUserId, toUserId } },
      create: { fromUserId: myUserId, toUserId },
      update: {},
    })

    const mutual = await prisma.connectLike.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: myUserId } },
    })
    isMatch = !!mutual
  }

  return NextResponse.json({
    isMatch,
    limitReached: false,
    swipesUsed: newCount,
    swipesRemaining: DAILY_SWIPE_LIMIT - newCount,
  })
}

// GET — return stats: matches, likes received, and today's swipe usage
export async function GET(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id
  if (!myUserId) return NextResponse.json({ receivedLikes: 0, matches: 0, swipesUsed: 0, swipesRemaining: DAILY_SWIPE_LIMIT, isPremium: false })

  const [user, receivedLikes, sentLikes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: myUserId },
      select: { isPremium: true, dailySwipeCount: true, dailySwipeDate: true },
    }),
    prisma.connectLike.findMany({ where: { toUserId: myUserId }, select: { fromUserId: true } }),
    prisma.connectLike.findMany({ where: { fromUserId: myUserId }, select: { toUserId: true } }),
  ])

  const sentSet = new Set(sentLikes.map(l => l.toUserId))
  const matches = receivedLikes.filter(l => sentSet.has(l.fromUserId)).length

  const swipesUsed = user && isToday(user.dailySwipeDate) ? user.dailySwipeCount : 0
  const isPremium  = user?.isPremium ?? false
  const swipesRemaining = isPremium ? Infinity : Math.max(0, DAILY_SWIPE_LIMIT - swipesUsed)

  return NextResponse.json({
    receivedLikes: receivedLikes.length,
    matches,
    swipesUsed,
    swipesRemaining: isPremium ? -1 : swipesRemaining,
    isPremium,
  })
}
