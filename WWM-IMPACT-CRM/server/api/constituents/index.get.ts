import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const rows = await prisma.constituent.findMany()
    return { data: rows }
  } catch (err) {
    return { error: 'Failed to fetch constituents', details: err }
  }
})
