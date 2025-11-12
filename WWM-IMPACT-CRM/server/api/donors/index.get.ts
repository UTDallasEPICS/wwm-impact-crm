import { defineEventHandler } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const donors = await prisma.donor.findMany()
    return { data: donors }
  } catch (err) {
    return { error: 'Failed to fetch donors', details: err }
  }
})
