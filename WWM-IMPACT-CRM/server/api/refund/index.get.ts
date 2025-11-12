import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const refunds = await prisma.refund.findMany()
    return { data: refunds }
  } catch (err) {
    return { error: 'Failed to fetch refunds', details: err }
  }
})
