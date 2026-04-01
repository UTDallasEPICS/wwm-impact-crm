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

    const data = await prismaAny.emailInterest.findUnique({ where: { id } })
    if (!data) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }
    return { data }
  } catch (e: any) {
    console.error('EmailInterest [id].get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
