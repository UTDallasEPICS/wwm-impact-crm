import { PrismaClient } from '@prisma/client'
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3'

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
const adapter = new PrismaBetterSQLite3({ url: databaseUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding organizations...')

  const organizations = [
    { name: 'test group1' },
    { name: 'test group2' },
    { name: 'test group3' },
    { name: 'test group4' },
    { name: 'test group5' },
    { name: 'test group6' },
    { name: 'test group7' },
    { name: 'test group8' },
    { name: 'test group9' },
    { name: 'test group10' },
  ]

  for (const org of organizations) {
    const existing = await prisma.organization.findFirst({
      where: { name: org.name },
    })

    if (existing) {
      console.log(`⏭️  Organization already exists: ${org.name}`)
    } else {
      const created = await prisma.organization.create({
        data: {
          name: org.name,
        },
      })
      console.log(`✅ Created organization: ${created.name}`)
    }
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
