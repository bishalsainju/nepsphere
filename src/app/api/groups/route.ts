import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildGeoWhere } from '@/lib/geo'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')
  const state   = searchParams.get('state')
  const city    = searchParams.get('city')

  const geoWhere = buildGeoWhere(country, state, city)

  const groups = await prisma.communityGroup.findMany({
    where: Object.keys(geoWhere).length > 0 ? geoWhere : undefined,
    include: { _count: { select: { members: true } } },
    orderBy: { membersCount: 'desc' },
  })

  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, emoji, city, state, country, slug, isPrivate } = body

  if (!name || !description || !slug) {
    return NextResponse.json({ error: 'name, description and slug are required' }, { status: 400 })
  }

  const existing = await prisma.communityGroup.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: 'A group with that name already exists' }, { status: 409 })
  }

  const group = await prisma.communityGroup.create({
    data: {
      name:        name.trim(),
      slug,
      description: description.trim(),
      emoji:       emoji    ?? '💬',
      city:        city     ?? 'Dallas',
      state:       state    ?? 'Texas',
      country:     country  ?? 'USA',
      isPrivate:   isPrivate ?? false,
      membersCount: 1,
    },
  })

  return NextResponse.json(group, { status: 201 })
}
