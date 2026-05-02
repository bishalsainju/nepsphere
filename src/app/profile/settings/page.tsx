import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/signin?callbackUrl=/profile/settings')

  const userId = (session.user as any).id as string
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, bio: true, city: true, state: true, country: true, isVerified: true, isAdmin: true, createdAt: true },
  })
  if (!user) redirect('/signin')

  return <SettingsClient user={user} />
}
