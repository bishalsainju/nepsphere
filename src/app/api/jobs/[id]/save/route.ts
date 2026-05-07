import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: jobId } = await params
  const userId = (session.user as any).id as string

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  })

  if (existing) {
    await prisma.savedJob.delete({ where: { userId_jobId: { userId, jobId } } })
    return NextResponse.json({ saved: false })
  }

  await prisma.savedJob.create({ data: { userId, jobId } })
  return NextResponse.json({ saved: true })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ saved: false })

  const { id: jobId } = await params
  const userId = (session.user as any).id as string

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  })

  return NextResponse.json({ saved: !!existing })
}
