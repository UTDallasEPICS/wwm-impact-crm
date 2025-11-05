import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const households = await prisma.household.findMany()
    return { data: households }
  } catch (err) {
    return { error: 'Failed to fetch households', details: err }
  }
})
