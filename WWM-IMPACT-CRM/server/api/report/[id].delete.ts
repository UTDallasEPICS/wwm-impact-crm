import prisma from '../../../lib/prisma'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const deletedReport = await prisma.report.delete({ where: { id } })
    return deletedReport
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
