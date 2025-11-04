import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

// Fallback Prisma in case @prisma/nuxt context is not available
const fallbackPrisma = new PrismaClient()

// GET /prisma-rest-api/constituents?skip=&take=&search=
export default defineEventHandler(async (event) => {
  try {
    if (event.method !== 'GET') {
      setResponseStatus(event, 405)
      return { error: 'Method Not Allowed' }
    }

    const q = getQuery(event)
    const skip = Number(q.skip ?? 0)
    const take = Number(q.take ?? 100)
    const search = (q.search as string) || ''

    // Prefer prisma from Nitro event context if provided by @prisma/nuxt
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma

    // Detect which model exists (Donor vs Constituents vs Constituent)
    const modelName = prismaAny.donor
      ? 'donor'
      : prismaAny.constituents
      ? 'constituents'
      : prismaAny.constituent
      ? 'constituent'
      : null

    if (modelName === 'constituents' || modelName === 'constituent') {
      const where = search
        ? {
            OR: [
              { First: { contains: search, mode: 'insensitive' as const } },
              { Last: { contains: search, mode: 'insensitive' as const } },
              { FullName: { contains: search, mode: 'insensitive' as const } },
              { SortName: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : undefined

      const items = await prismaAny[modelName].findMany({
        where,
        skip,
        take,
        orderBy: { AccountNumber: 'asc' },
      })
      return { data: items }
    }

    if (modelName === 'donor') {
      const where = search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : undefined

      const items = await prismaAny.donor.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      })
      return { data: items }
    }

    setResponseStatus(event, 500)
    return { error: 'No matching Prisma model found (expected Constituents or Donor)' }
  } catch (e: any) {
    console.error('Constituents route error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
