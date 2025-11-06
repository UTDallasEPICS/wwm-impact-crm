import prisma from '../../utils/prisma'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const funds = await prisma.fund.findMany()
    return funds
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch funds' })
  }
})