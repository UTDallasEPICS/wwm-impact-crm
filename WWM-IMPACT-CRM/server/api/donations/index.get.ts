import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const donations = await prisma.donation.findMany()
    return { data: donations }
  } catch (err) {
    return { error: 'Failed to fetch donations', details: err }
  }
})
