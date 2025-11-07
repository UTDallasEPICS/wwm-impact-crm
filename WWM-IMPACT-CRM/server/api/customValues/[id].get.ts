import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const row = await prisma.customValue.findUnique({ where: { id }, include: { field: true } })
    if (!row) {
      event.node.res.statusCode = 404
      return { error: 'CustomValue not found' }
    }
    return { data: row }
  } catch (err) {
    return { error: 'Failed to fetch custom value', details: err }
  }
})
