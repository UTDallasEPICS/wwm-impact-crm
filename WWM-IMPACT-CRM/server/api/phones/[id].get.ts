import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const phone = await prisma.phone.findUnique({ where: { id } })

    if (!phone) {
      event.node.res.statusCode = 404
      return { error: 'Phone not found' }
    }

    return { data: phone }
  } catch (err) {
    return { error: 'Failed to fetch phone', details: err }
  }
})
