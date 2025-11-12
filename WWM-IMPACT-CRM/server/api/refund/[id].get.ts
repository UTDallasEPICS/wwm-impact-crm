import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const refund = await prisma.refund.findUnique({ where: { id } })
    if (!refund) {
      event.node.res.statusCode = 404
      return { error: 'Refund not found' }
    }
    return { data: refund }
  } catch (err) {
    return { error: 'Failed to fetch refund', details: err }
  }
})
