import prisma from '../../utils/prisma'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const fund = await prisma.fund.findUnique({ where: { id } })
    if (!fund) {
      throw createError({ statusCode: 404, statusMessage: 'Fund not found' })
    }
    return fund
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch fund' })
  }
})