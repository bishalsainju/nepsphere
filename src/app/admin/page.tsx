import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminClient } from './AdminClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.isAdmin) redirect('/signin')

  const [totalUsers, verifiedUsers, totalPosts, totalRooms, totalJobs, totalConnect, totalGroups] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.post.count(),
    prisma.room.count(),
    prisma.job.count(),
    prisma.connectProfile.count(),
    prisma.communityGroup.count(),
  ])

  const [users, posts, jobs, rooms, connect] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, name: true, email: true, city: true, state: true, isVerified: true, isAdmin: true, createdAt: true },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, title: true, category: true, city: true, createdAt: true, author: { select: { name: true } } },
    }),
    prisma.job.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, title: true, company: true, type: true, city: true, sponsorship: true, createdAt: true },
    }),
    prisma.room.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, title: true, price: true, type: true, city: true, createdAt: true, host: { select: { name: true } } },
    }),
    prisma.connectProfile.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, userId: true, intent: true, age: true, gender: true, city: true, hometown: true, religion: true, isVisible: true, createdAt: true, user: { select: { name: true } } },
    }),
  ])

  return (
    <AdminClient
      stats={{ totalUsers, verifiedUsers, totalPosts, totalRooms, totalJobs, totalConnect, totalGroups }}
      initialUsers={users}
      initialPosts={posts}
      initialJobs={jobs}
      initialRooms={rooms}
      initialConnect={connect}
    />
  )
}
