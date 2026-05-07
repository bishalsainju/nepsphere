import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MessagesGate } from './MessagesGate'

export default async function MessagesPage() {
  const session  = await getServerSession(authOptions)
  const myUserId = (session?.user as any)?.id as string | undefined

  const user = myUserId
    ? await prisma.user.findUnique({ where: { id: myUserId }, select: { isPremium: true } })
    : null
  const isPremium = user?.isPremium ?? false

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Link href="/connect" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Connect
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 20 }}>
        Messages
      </h1>

      <MessagesGate isPremium={isPremium} />
    </div>
  )
}
