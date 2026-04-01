import prisma from '../../../lib/prisma'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const report = await prisma.report.findUnique({ where: { id } })
    if (!report) {
      throw createError({ statusCode: 404, statusMessage: 'Report not found' })
    }
    return report
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch report' })
  }
})
