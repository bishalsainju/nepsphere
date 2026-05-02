import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { type, id, value } = await req.json()

  switch (type) {
    case 'verify_user':
      await prisma.user.update({ where: { id }, data: { isVerified: !!value, verifiedAt: value ? new Date() : null } })
      break
    case 'admin_user':
      await prisma.user.update({ where: { id }, data: { isAdmin: !!value } })
      break
    case 'delete_post':
      await prisma.post.delete({ where: { id } })
      break
    case 'delete_job':
      await prisma.job.delete({ where: { id } })
      break
    case 'delete_room':
      await prisma.room.delete({ where: { id } })
      break
    case 'toggle_connect':
      await prisma.connectProfile.update({ where: { id }, data: { isVisible: !!value } })
      break
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
