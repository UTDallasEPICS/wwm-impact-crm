import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const appeals = await prisma.appeal.findMany()
    return { data: appeals }
  } catch (err) {
    return { error: 'Failed to fetch appeals', details: err }
  }
})
