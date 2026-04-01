import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
  const prismaAny: any = prisma
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

    const existing = await prismaAny.emailInterest.findUnique({ where: { id } })
    if (!existing) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }
    await prismaAny.emailInterest.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    console.error('EmailInterest [id].delete error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
