import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
async function main() {
  const counts = await prisma.connectProfile.groupBy({ by: ['city'], _count: true, orderBy: [{ city: 'asc' }] })
  counts.forEach((r: any) => console.log((r.city ?? '?').padEnd(15), r._count))
  const total = await prisma.connectProfile.count()
  console.log('\nTotal:', total)
}
main().then(() => prisma.$disconnect()).catch((e: any) => { console.error(e); process.exit(1) })
