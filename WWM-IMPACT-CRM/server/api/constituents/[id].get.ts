import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const row = await prisma.constituent.findUnique({ where: { id } })
    if (!row) {
      event.node.res.statusCode = 404
      return { error: 'Constituent not found' }
    }
    return { data: row }
  } catch (err) {
    return { error: 'Failed to fetch constituent', details: err }
  }
})
