import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')

  const videos = await prisma.video.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true, image: true } } },
  })
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Sign in to share a video' }, { status: 401 })

  const { title, description, url, category } = await req.json()
  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
  }

  const video = await prisma.video.create({
    data: { title: title.trim(), description: description?.trim() || null, url: url.trim(), category: category || null, authorId: userId },
    include: { author: { select: { id: true, name: true, image: true } } },
  })
  return NextResponse.json(video, { status: 201 })
}
