import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
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

    const existing = await prismaAny.softCredit.findUnique({ where: { id } })
    if (!existing) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }

    await prismaAny.softCredit.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    console.error('SoftCredits [id].delete error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
