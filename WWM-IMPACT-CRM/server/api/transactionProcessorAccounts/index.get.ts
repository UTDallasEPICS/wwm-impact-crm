import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const q = getQuery(event)

    const skip = q.skip ? Number(q.skip) : undefined
    const take = q.take ? Number(q.take) : undefined

    const isActive = typeof q.isActive !== 'undefined' ? String(q.isActive).toLowerCase() === 'true' : undefined
    const name = (q.name as string) || undefined
    const stripeAccountId = (q.stripeAccountId as string) || undefined
    const appliesTo = (q.appliesTo as string) || undefined
    const categoryName = (q.categoryName as string) || undefined
    const dataType = (q.dataType as string) || undefined
    const type = (q.type as string) || undefined

    const hasStripe = typeof q.hasStripe !== 'undefined' ? String(q.hasStripe).toLowerCase() === 'true' : undefined

    const search = (q.search as string) || ''

    const where: any = {}
    if (typeof isActive === 'boolean') where.isActive = isActive
    if (name) where.name = { contains: name, mode: 'insensitive' as const }
    if (stripeAccountId) where.stripeAccountId = { contains: stripeAccountId, mode: 'insensitive' as const }
    if (appliesTo) where.appliesTo = { contains: appliesTo, mode: 'insensitive' as const }
    if (categoryName) where.categoryName = { contains: categoryName, mode: 'insensitive' as const }
    if (dataType) where.dataType = { contains: dataType, mode: 'insensitive' as const }
    if (type) where.type = { contains: type, mode: 'insensitive' as const }

    if (typeof hasStripe === 'boolean') where.stripeAccountId = hasStripe ? { not: null } : null

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { stripeAccountId: { contains: search, mode: 'insensitive' as const } },
        { appliesTo: { contains: search, mode: 'insensitive' as const } },
        { categoryName: { contains: search, mode: 'insensitive' as const } },
        { dataType: { contains: search, mode: 'insensitive' as const } },
        { type: { contains: search, mode: 'insensitive' as const } },
      ]
    }

    const data = await prismaAny.transactionProcessorAccount.findMany({
      where: Object.keys(where).length ? where : undefined,
      skip,
      take,
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    })
    return { data }
  } catch (e: any) {
    console.error('TransactionProcessorAccounts index.get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
