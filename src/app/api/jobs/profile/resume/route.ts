import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put, del } from '@vercel/blob'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED   = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Only PDF and Word documents are allowed' }, { status: 400 })
  }

  const profile = await prisma.jobProfile.findUnique({
    where: { userId },
    select: { id: true, resumeUrl: true },
  })

  const blob = await put(`resumes/${userId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  if (profile?.resumeUrl) {
    await del(profile.resumeUrl).catch(() => {})
  }

  await prisma.jobProfile.upsert({
    where:  { userId },
    create: { userId, resumeUrl: blob.url, resumeFile: file.name },
    update: { resumeUrl: blob.url, resumeFile: file.name },
  })

  return NextResponse.json({ url: blob.url, filename: file.name })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.jobProfile.findUnique({
    where: { userId },
    select: { resumeUrl: true },
  })

  if (profile?.resumeUrl) {
    await del(profile.resumeUrl).catch(() => {})
    await prisma.jobProfile.update({
      where: { userId },
      data:  { resumeUrl: null, resumeFile: null },
    })
  }

  return NextResponse.json({ ok: true })
}
