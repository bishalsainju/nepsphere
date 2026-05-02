import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
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

const connectionString = resolveConnectionString(process.env.DATABASE_URL ?? '')
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const ADMIN_ACCOUNTS = [
  { id: 'admin_bishal',   email: 'bishalsainju8848@gmail.com', name: 'Bishal Sainju' },
  { id: 'admin_swarniga', email: 'swarnigallc@gmail.com',      name: 'Nepsphere Admin' },
]

async function main() {
  for (const a of ADMIN_ACCOUNTS) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      create: {
        id:          a.id,
        email:       a.email,
        name:        a.name,
        isVerified:  true,
        isAdmin:     true,
        city:        'Dallas',
        state:       'Texas',
        country:     'USA',
      },
      update: {
        isAdmin:    true,
        isVerified: true,
      },
    })
    console.log(`Admin user ready: ${user.email} (id: ${user.id})`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
