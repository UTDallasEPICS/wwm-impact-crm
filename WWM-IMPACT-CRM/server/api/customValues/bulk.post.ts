import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { entityType, entityIds, withField } = body || {}

    if (!entityType || !Array.isArray(entityIds) || entityIds.length === 0) {
      event.node.res.statusCode = 400
      return { error: 'entityType and non-empty entityIds[] are required' }
    }

    const values = await prisma.customValue.findMany({
      where: { entityType, entityId: { in: entityIds } },
      include: withField ? { field: true } : undefined,
    })

    // Optional: group by entityId for easy merging client-side
    const byId: Record<string, any[]> = {}
    for (const v of values) (byId[v.entityId] ||= []).push(v)

    return { data: byId }
  } catch (err) {
    return { error: 'Failed to fetch custom values (bulk)', details: err }
  }
})
