import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

    const b = (await readBody(event)) || {}

    const data: Record<string, any> = {}
    if (b.name !== undefined) data.name = b.name?.trim?.()
    if (b.isActive !== undefined) data.isActive = Boolean(b.isActive)
    if (b.stripeAccountId !== undefined) data.stripeAccountId = b.stripeAccountId?.trim?.() || (b.stripeAccountId === null ? null : undefined)
    if (b.appliesTo !== undefined) data.appliesTo = b.appliesTo?.trim?.() || (b.appliesTo === null ? null : undefined)
    if (b.categoryName !== undefined) data.categoryName = b.categoryName?.trim?.() || (b.categoryName === null ? null : undefined)
    if (b.dataType !== undefined) data.dataType = b.dataType?.trim?.() || (b.dataType === null ? null : undefined)
    if (b.type !== undefined) data.type = b.type?.trim?.() || (b.type === null ? null : undefined)

    if (!Object.keys(data).length) {
      setResponseStatus(event, 400)
      return { error: 'No updatable fields provided' }
    }

    const updated = await prismaAny.transactionProcessorAccount.update({ where: { id }, data })
    return { data: updated }
  } catch (e: any) {
    console.error('TransactionProcessorAccounts [id].patch error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
