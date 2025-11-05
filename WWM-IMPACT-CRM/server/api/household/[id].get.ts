import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const household = await prisma.household.findUnique({ where: { id } })

    if (!household) {
      event.node.res.statusCode = 404
      return { error: 'Household not found' }
    }

    return { data: household }
  } catch (err) {
    return { error: 'Failed to fetch household', details: err }
  }
})
