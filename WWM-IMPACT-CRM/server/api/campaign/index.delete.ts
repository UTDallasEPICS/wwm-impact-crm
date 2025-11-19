import prisma from '../../../lib/prisma'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const campaigns  = await prisma.fund.deleteMany()
    return campaigns
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch campaigns' })
  }
})