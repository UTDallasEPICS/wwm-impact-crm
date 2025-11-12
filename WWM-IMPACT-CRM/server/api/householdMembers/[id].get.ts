import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const member = await prisma.householdMember.findUnique({ where: { id } })

    if (!member) {
      event.node.res.statusCode = 404
      return { error: 'HouseholdMember not found' }
    }

    return { data: member }
  } catch (err) {
    return { error: 'Failed to fetch household member', details: err }
  }
})
