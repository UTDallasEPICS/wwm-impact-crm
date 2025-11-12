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

    const data = await prismaAny.constituents.findUnique({ where: { AccountNumber: accountNumber } })
    if (!data) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }
    return { data }
  } catch (e: any) {
    console.error('Constituents [accountNumber].get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
