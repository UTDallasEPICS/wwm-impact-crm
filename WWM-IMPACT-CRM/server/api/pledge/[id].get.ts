import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const pledge = await prisma.pledge.findUnique({ where: { id } })
    if (!pledge) {
      event.node.res.statusCode = 404
      return { error: 'Pledge not found' }
    }
    return { data: pledge }
  } catch (err) {
    return { error: 'Failed to fetch pledge', details: err }
  }
})
