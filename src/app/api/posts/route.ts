import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'
import { z } from 'zod'

const PostSchema = z.object({
  title:    z.string().min(5).max(200),
  body:     z.string().min(10),
  category: z.enum(['VISA', 'JOBS', 'LIFE_ABROAD', 'STUDENT', 'FOOD_CULTURE', 'GENERAL']),
  city:     z.string(),
  state:    z.string().optional(),
  country:  z.string().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country  = searchParams.get('country')
  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const category = searchParams.get('category')

  const geoWhere = buildGeoWhere(country, state, city)

  const posts = await prisma.post.findMany({
    where: {
      ...geoWhere,
      ...(category && category !== 'all' ? { category: category as any } : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true, isVerified: true, city: true } },
      _count:  { select: { replies: true } },
    },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  })

  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = PostSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      state:    parsed.data.state   ?? 'Texas',
      country:  parsed.data.country ?? 'USA',
      authorId: (session.user as any).id,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
