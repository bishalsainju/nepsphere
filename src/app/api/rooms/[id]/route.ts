import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const room = await prisma.room.findUnique({
    where: { id },
    include: { host: { select: { id: true, name: true, image: true, isVerified: true } } },
  })
  if (!room) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(room)
}
