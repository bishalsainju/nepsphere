import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type ExperienceInput = {
  role: string
  company: string
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  current?: boolean
  description?: string | null
}

type EducationInput = {
  school: string
  degree?: string | null
  field?: string | null
  startYear?: string | null
  endYear?: string | null
}

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json(null)

  const profile = await prisma.jobProfile.findUnique({
    where: { userId },
    include: {
      experiences: { orderBy: { sortOrder: 'asc' } },
      education:   { orderBy: { sortOrder: 'asc' } },
    },
  })
  return NextResponse.json(profile)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Sign in to save your profile' }, { status: 401 })

  const body = await req.json()
  const {
    headline, about, skills, languages, workAuth,
    city, state, country, linkedinUrl, portfolioUrl,
    experiences, education,
  } = body

  if (!headline?.trim() || !about?.trim()) {
    return NextResponse.json({ error: 'Headline and about are required' }, { status: 400 })
  }

  const expList: ExperienceInput[] = Array.isArray(experiences) ? experiences : []
  const eduList: EducationInput[]  = Array.isArray(education)   ? education   : []

  const profileData = {
    headline:     headline.trim(),
    about:        about.trim(),
    skills:       Array.isArray(skills)    ? skills.filter(Boolean)    : [],
    languages:    Array.isArray(languages) ? languages.filter(Boolean) : [],
    workAuth:     workAuth     || null,
    city:         city         || null,
    state:        state        || null,
    country:      country      || null,
    linkedinUrl:  linkedinUrl  || null,
    portfolioUrl: portfolioUrl || null,
  }

  const profile = await prisma.$transaction(async tx => {
    const existing = await tx.jobProfile.upsert({
      where:  { userId },
      create: { userId, ...profileData },
      update: profileData,
    })

    await tx.jobExperience.deleteMany({ where: { profileId: existing.id } })
    await tx.jobEducation.deleteMany({  where: { profileId: existing.id } })

    if (expList.length) {
      await tx.jobExperience.createMany({
        data: expList
          .filter(e => e.role?.trim() && e.company?.trim())
          .map((e, i) => ({
            profileId:   existing.id,
            role:        e.role.trim(),
            company:     e.company.trim(),
            location:    e.location?.trim()    || null,
            startDate:   e.startDate?.trim()   || null,
            endDate:     e.current ? null : (e.endDate?.trim() || null),
            current:     !!e.current,
            description: e.description?.trim() || null,
            sortOrder:   i,
          })),
      })
    }

    if (eduList.length) {
      await tx.jobEducation.createMany({
        data: eduList
          .filter(e => e.school?.trim())
          .map((e, i) => ({
            profileId: existing.id,
            school:    e.school.trim(),
            degree:    e.degree?.trim()    || null,
            field:     e.field?.trim()     || null,
            startYear: e.startYear?.trim() || null,
            endYear:   e.endYear?.trim()   || null,
            sortOrder: i,
          })),
      })
    }

    return tx.jobProfile.findUnique({
      where: { userId },
      include: {
        experiences: { orderBy: { sortOrder: 'asc' } },
        education:   { orderBy: { sortOrder: 'asc' } },
      },
    })
  })

  return NextResponse.json(profile)
}
