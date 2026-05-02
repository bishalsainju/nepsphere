import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { body } = await req.json()

  if (!body?.trim()) return NextResponse.json({ error: 'Reply body required' }, { status: 400 })

  const reply = await prisma.reply.create({
    data: { body, postId: id, authorId: (session.user as any).id },
  })

  return NextResponse.json(reply, { status: 201 })
}
