import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: jobId } = await params
  const userId = (session.user as any).id as string
  const { note } = await req.json().catch(() => ({ note: '' }))

  const profile = await prisma.jobProfile.findUnique({
    where: { userId },
    select: { id: true, headline: true, about: true },
  })
  if (!profile?.headline?.trim() || !profile.about?.trim()) {
    return NextResponse.json(
      { error: 'Create a job profile before applying', profileRequired: true },
      { status: 403 },
    )
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { userId_jobId: { userId, jobId } },
  })
  if (existing) return NextResponse.json({ applied: true, alreadyApplied: true })

  await prisma.jobApplication.create({ data: { userId, jobId, note: note ?? null } })
  return NextResponse.json({ applied: true }, { status: 201 })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ applied: false })

  const { id: jobId } = await params
  const userId = (session.user as any).id as string

  const existing = await prisma.jobApplication.findUnique({
    where: { userId_jobId: { userId, jobId } },
  })

  return NextResponse.json({ applied: !!existing })
}
