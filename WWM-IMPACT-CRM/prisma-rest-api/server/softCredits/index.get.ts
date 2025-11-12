import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const q = getQuery(event)

    const skip = q.skip ? Number(q.skip) : undefined
    const take = q.take ? Number(q.take) : undefined

    const donationId = (q.donationId as string) || undefined
    const creditedToId = (q.creditedToId as string) || undefined
    const acknowledged =
      typeof q.acknowledged !== 'undefined' ? String(q.acknowledged).toLowerCase() === 'true' : undefined
    const designationNumber = q.designationNumber !== undefined ? Number(q.designationNumber) : undefined

    const minAmount = q.minAmount !== undefined ? Number(q.minAmount) : undefined
    const maxAmount = q.maxAmount !== undefined ? Number(q.maxAmount) : undefined

    const dateFrom = q.dateFrom ? new Date(String(q.dateFrom)) : undefined
    const dateTo = q.dateTo ? new Date(String(q.dateTo)) : undefined

    const search = (q.search as string) || ''

    const where: any = {}
    if (donationId) where.donationId = donationId
    if (creditedToId) where.creditedToId = creditedToId
    if (typeof acknowledged === 'boolean') where.acknowledged = acknowledged
    if (typeof designationNumber === 'number' && !Number.isNaN(designationNumber)) where.designationNumber = designationNumber
    if (typeof minAmount === 'number' && !Number.isNaN(minAmount)) where.amount = { ...(where.amount || {}), gte: minAmount }
    if (typeof maxAmount === 'number' && !Number.isNaN(maxAmount)) where.amount = { ...(where.amount || {}), lte: maxAmount, ...(where.amount || {}) }
    if (dateFrom || dateTo) {
      where.createdDate = {}
      if (dateFrom) where.createdDate.gte = dateFrom
      if (dateTo) where.createdDate.lte = dateTo
    }
    if (search) {
      where.OR = [
        { note: { contains: search, mode: 'insensitive' as const } },
        { createdName: { contains: search, mode: 'insensitive' as const } },
        { lastModifiedName: { contains: search, mode: 'insensitive' as const } },
      ]
    }

    const data = await prismaAny.softCredit.findMany({
      where: Object.keys(where).length ? where : undefined,
      skip,
      take,
      orderBy: { createdDate: 'desc' },
    })
    return { data }
  } catch (e: any) {
    console.error('SoftCredits index.get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
