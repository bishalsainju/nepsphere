import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/signin?callbackUrl=/profile')

  const { tab: tabParam } = await searchParams
  const validTabs = ['community', 'connect', 'jobs', 'rooms'] as const
  type Tab = typeof validTabs[number]
  const initialTab = validTabs.includes(tabParam as Tab) ? (tabParam as Tab) : undefined

  const userId = (session.user as any).id as string

  const [user, posts, jobs, rooms, connectProfile, savedRooms, savedJobs, appliedJobs, jobProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, city: true, state: true, country: true, isVerified: true, isAdmin: true, createdAt: true, bio: true },
    }),
    prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, category: true, city: true, likes: true, createdAt: true, _count: { select: { replies: true } } },
    }),
    prisma.job.findMany({
      where: { postedById: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, company: true, type: true, city: true, sponsorship: true, createdAt: true },
    }),
    prisma.room.findMany({
      where: { hostId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, price: true, type: true, city: true, isAvailable: true, createdAt: true },
    }),
    prisma.connectProfile.findUnique({
      where: { userId },
      select: { id: true, userId: true, intents: true, bio: true, age: true, gender: true, height: true, city: true, hometown: true, religion: true, caste: true, occupation: true, education: true, lookingFor: true, isVisible: true },
    }),
    prisma.savedRoom.findMany({
      where: { userId },
      orderBy: { room: { createdAt: 'desc' } },
      include: { room: { select: { id: true, title: true, price: true, type: true, city: true, isAvailable: true, createdAt: true } } },
    }),
    prisma.savedJob.findMany({
      where: { userId },
      orderBy: { job: { createdAt: 'desc' } },
      include: { job: { select: { id: true, title: true, company: true, type: true, city: true, sponsorship: true, createdAt: true } } },
    }),
    prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, company: true, type: true, city: true, sponsorship: true, createdAt: true } } },
    }),
    prisma.jobProfile.findUnique({
      where: { userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' }, take: 2 },
        education:   { orderBy: { sortOrder: 'asc' }, take: 2 },
      },
    }),
  ])

  if (!user) redirect('/signin')

  let connectStats = { likerProfiles: [] as any[], matches: [] as any[], likesReceived: 0, unreadMessages: 0 }
  try {
    const [likesReceived, sentLikes, unreadMessages] = await Promise.all([
      prisma.connectLike.findMany({ where: { toUserId: userId }, orderBy: { createdAt: 'desc' }, select: { fromUserId: true } }),
      prisma.connectLike.findMany({ where: { fromUserId: userId }, select: { toUserId: true } }),
      prisma.message.count({ where: { toUserId: userId, read: false } }),
    ])
    const sentSet      = new Set(sentLikes.map((l: any) => l.toUserId))
    const likerUserIds = likesReceived.map((l: any) => l.fromUserId)
    const likerProfiles = likerUserIds.length > 0
      ? await prisma.connectProfile.findMany({
          where: { userId: { in: likerUserIds }, isVisible: true },
          include: { user: { select: { id: true, name: true, image: true, isVerified: true } } },
        })
      : []
    connectStats = {
      likerProfiles,
      matches: likerProfiles.filter((p: any) => sentSet.has(p.userId)),
      likesReceived: likesReceived.length,
      unreadMessages,
    }
  } catch {
    // connect stats unavailable — show empty
  }

  return (
    <ProfileClient
      user={user}
      posts={posts}
      jobs={jobs}
      rooms={rooms}
      savedRooms={savedRooms.map(s => s.room)}
      savedJobs={savedJobs.map(s => s.job)}
      appliedJobs={appliedJobs.map(a => a.job)}
      connectProfile={connectProfile}
      connectStats={connectStats}
      jobProfile={jobProfile}
      initialTab={initialTab}
    />
  )
}
