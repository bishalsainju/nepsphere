import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

function resolveConnectionString(dbUrl: string): string {
  if (!dbUrl.startsWith('prisma+postgres://')) return dbUrl
  try {
    const apiKey = new URL(dbUrl).searchParams.get('api_key') ?? ''
    const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf8'))
    return decoded.databaseUrl ?? dbUrl
  } catch {
    return dbUrl
  }
}

function createPrismaClient() {
  const connectionString = resolveConnectionString(process.env.DATABASE_URL ?? '')
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? [] : [],
  })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
