import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event)
    const entityType = String(q.entityType || '')
    const entityId = String(q.entityId || '')
    const withField = String(q.withField ?? '').toLowerCase() === 'true' // include field metadata

    if (!entityType || !entityId) {
      event.node.res.statusCode = 400
      return { error: 'entityType and entityId are required' }
    }

    const values = await prisma.customValue.findMany({
      where: { entityType, entityId },
      include: withField ? { field: true } : undefined,
    })

    return { data: values }
  } catch (err) {
    return { error: 'Failed to fetch custom values', details: err }
  }
})
