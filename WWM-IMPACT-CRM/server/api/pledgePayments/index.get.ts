import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const items = await prisma.pledgePayment.findMany()
    return { data: items }
  } catch (err) {
    return { error: 'Failed to fetch pledge payments', details: err }
  }
})
