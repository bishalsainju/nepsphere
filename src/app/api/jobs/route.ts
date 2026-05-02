import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'
import { z } from 'zod'

const JobSchema = z.object({
  title:       z.string().min(3).max(200),
  company:     z.string().min(2).max(200),
  description: z.string().min(20),
  type:        z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'GIG', 'INTERNSHIP']),
  location:    z.string(),
  city:        z.string(),
  state:       z.string().optional(),
  country:     z.string().optional().default('USA'),
  salary:      z.string().optional(),
  sponsorship: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country     = searchParams.get('country')
  const state       = searchParams.get('state')
  const city        = searchParams.get('city')
  const sponsorship = searchParams.get('sponsorship') === 'true'
  const type        = searchParams.get('type')

  const geoWhere = buildGeoWhere(country, state, city)

  const jobs = await prisma.job.findMany({
    where: {
      ...geoWhere,
      ...(sponsorship ? { sponsorship: true } : {}),
      ...(type ? { type: type as any } : {}),
    },
    include: { postedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(jobs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = JobSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const job = await prisma.job.create({
    data: { ...parsed.data, postedById: (session.user as any).id },
  })

  return NextResponse.json(job, { status: 201 })
}
