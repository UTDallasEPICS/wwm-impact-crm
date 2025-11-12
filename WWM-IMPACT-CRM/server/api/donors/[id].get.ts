import { defineEventHandler, getRouterParam } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const donor = await prisma.donor.findUnique({ where: { id } })

    if (!donor) {
      event.node.res.statusCode = 404
      return { error: 'Donor not found' }
    }
    return { data: donor }
  } catch (err) {
    return { error: 'Failed to fetch donor', details: err }
  }
})
