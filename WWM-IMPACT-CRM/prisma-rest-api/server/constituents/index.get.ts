import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const q = getQuery(event)
    const skip = q.skip ? Number(q.skip) : undefined
    const take = q.take ? Number(q.take) : undefined
    const search = (q.search as string) || ''

    const where = search
      ? {
          OR: [
            { First: { contains: search, mode: 'insensitive' as const } },
            { Last: { contains: search, mode: 'insensitive' as const } },
            { FullName: { contains: search, mode: 'insensitive' as const } },
            { SortName: { contains: search, mode: 'insensitive' as const } },
            { RecognitionName: { contains: search, mode: 'insensitive' as const } },
            { InformalName: { contains: search, mode: 'insensitive' as const } },
            { FormalName: { contains: search, mode: 'insensitive' as const } },
            { EnvelopeName: { contains: search, mode: 'insensitive' as const } },
            { AccountNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined

    const data = await prismaAny.constituents.findMany({
      where,
      skip,
      take,
      orderBy: { SortName: 'asc' },
    })
    return { data }
  } catch (e: any) {
    console.error('Constituents index.get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
