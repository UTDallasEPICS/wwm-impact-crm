import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const q = getQuery(event)

    const skip = q.skip ? Number(q.skip) : undefined
    const take = q.take ? Number(q.take) : undefined

    const constituentId = (q.constituentId as string) || undefined
    const designationNumber = q.designationNumber !== undefined ? Number(q.designationNumber) : undefined

    const expFrom = q.expFrom ? new Date(String(q.expFrom)) : undefined
    const expTo = q.expTo ? new Date(String(q.expTo)) : undefined

    const creditCardType = (q.creditCardType as string) || undefined
    const eftAccountType = (q.eftAccountType as string) || undefined

    const hasToken = typeof q.hasToken !== 'undefined' ? String(q.hasToken).toLowerCase() === 'true' : undefined

    const search = (q.search as string) || ''

    const where: any = {}
    if (constituentId) where.constituentId = constituentId
    if (typeof designationNumber === 'number' && !Number.isNaN(designationNumber)) where.designationNumber = designationNumber
    if (creditCardType) where.creditCardType = { contains: creditCardType, mode: 'insensitive' as const }
    if (eftAccountType) where.eftAccountType = { contains: eftAccountType, mode: 'insensitive' as const }
    if (typeof hasToken === 'boolean') where.paymentMethodToken = hasToken ? { not: null } : null

    if (expFrom || expTo) {
      where.creditCardExpiration = {}
      if (expFrom) where.creditCardExpiration.gte = expFrom
      if (expTo) where.creditCardExpiration.lte = expTo
    }

    if (search) {
      where.OR = [
        { creditCardNumberMasked: { contains: search, mode: 'insensitive' as const } },
        { eftAccountNumberMasked: { contains: search, mode: 'insensitive' as const } },
        { eftRoutingNumberMasked: { contains: search, mode: 'insensitive' as const } },
        { paymentMethodToken: { contains: search, mode: 'insensitive' as const } },
      ]
    }

    const data = await prismaAny.walletItem.findMany({
      where: Object.keys(where).length ? where : undefined,
      skip,
      take,
      orderBy: [
        { creditCardExpiration: 'desc' },
        { id: 'asc' },
      ],
    })
    return { data }
  } catch (e: any) {
    console.error('WalletItems index.get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
