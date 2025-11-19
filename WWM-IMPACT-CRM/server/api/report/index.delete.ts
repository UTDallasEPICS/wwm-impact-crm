import prisma from '../../../lib/prisma'
import { createError, defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const deletedReports = await prisma.report.deleteMany()
    return { count: deletedReports.count }
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete reports' })
  }
})
