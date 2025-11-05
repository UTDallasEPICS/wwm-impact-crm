import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const item = await prisma.recurringDonationPayment.findUnique({ where: { id } })
    if (!item) {
      event.node.res.statusCode = 404
      return { error: 'RecurringDonationPayment not found' }
    }
    return { data: item }
  } catch (err) {
    return { error: 'Failed to fetch recurring donation payment', details: err }
  }
})
