import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const accountNumber = getRouterParam(event, 'accountNumber')
    if (!accountNumber) {
      setResponseStatus(event, 400)
      return { error: 'accountNumber param is required' }
    }

    const existing = await prismaAny.constituents.findUnique({ where: { AccountNumber: accountNumber } })
    if (!existing) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }
    await prismaAny.constituents.delete({ where: { AccountNumber: accountNumber } })
    return { ok: true }
  } catch (e: any) {
    console.error('Constituents [accountNumber].delete error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
