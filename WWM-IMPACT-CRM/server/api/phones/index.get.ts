import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const phones = await prisma.phone.findMany()
    return { data: phones }
  } catch (err) {
    return { error: 'Failed to fetch phones', details: err }
  }
})
