import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: roomId } = await params
  const userId = (session.user as any).id as string

  const existing = await prisma.savedRoom.findUnique({
    where: { userId_roomId: { userId, roomId } },
  })

  if (existing) {
    await prisma.savedRoom.delete({ where: { userId_roomId: { userId, roomId } } })
    return NextResponse.json({ saved: false })
  }

  await prisma.savedRoom.create({ data: { userId, roomId } })
  return NextResponse.json({ saved: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ saved: false })

  const { id: roomId } = await params
  const userId = (session.user as any).id as string

  const existing = await prisma.savedRoom.findUnique({
    where: { userId_roomId: { userId, roomId } },
  })

  return NextResponse.json({ saved: !!existing })
}
