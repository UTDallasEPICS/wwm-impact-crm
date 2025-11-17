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
    const isActive = typeof q.isActive !== 'undefined' ? String(q.isActive).toLowerCase() === 'true' : undefined

    const where: any = {}
    if (search) where.name = { contains: search, mode: 'insensitive' as const }
    if (typeof isActive === 'boolean') where.isActive = isActive

    const data = await prismaAny.emailInterest.findMany({
      where: Object.keys(where).length ? where : undefined,
      skip,
      take,
      orderBy: { name: 'asc' },
    })
    return { data }
  } catch (e: any) {
    console.error('EmailInterest index.get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
