import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
  const prismaAny: any = prisma
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

    const b = (await readBody(event)) || {}
    const data: Record<string, any> = {}
    if (b.name !== undefined) data.name = String(b.name).trim()
    if (b.isActive !== undefined) data.isActive = Boolean(b.isActive)
    if (!Object.keys(data).length) {
      setResponseStatus(event, 400)
      return { error: 'No updatable fields provided' }
    }

    const updated = await prismaAny.emailInterest.update({ where: { id }, data })
    return { data: updated }
  } catch (e: any) {
    console.error('EmailInterest [id].patch error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
