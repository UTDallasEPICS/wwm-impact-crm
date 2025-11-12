import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const designations = await prisma.designation.findMany()
    return { data: designations }
  } catch (err) {
    return { error: 'Failed to fetch designations', details: err }
  }
})
