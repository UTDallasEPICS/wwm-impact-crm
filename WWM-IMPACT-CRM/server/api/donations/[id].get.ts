import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) {
      event.node.res.statusCode = 404
      return { error: 'Donation not found' }
    }
    return { data: donation }
  } catch (err) {
    return { error: 'Failed to fetch donation', details: err }
  }
})
