import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
  // Use shared Prisma client
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

  const data = await prisma.softCredit.findUnique({ where: { id } })
    if (!data) {
      setResponseStatus(event, 404)
      return { error: 'Not found' }
    }
    return { data }
  } catch (e: any) {
    console.error('SoftCredits [id].get error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
