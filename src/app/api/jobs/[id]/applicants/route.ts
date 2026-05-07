import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: jobId } = await params

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { postedById: true },
  })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.postedById !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true, name: true, image: true, email: true, isVerified: true,
          jobProfile: {
            include: {
              experiences: { orderBy: { sortOrder: 'asc' } },
              education:   { orderBy: { sortOrder: 'asc' } },
            },
          },
        },
      },
    },
  })

  return NextResponse.json(applications)
}
