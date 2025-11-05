import prisma from '../../utils/prisma'
import { createError, defineEventHandler } from 'h3'


export default defineEventHandler(async () => {
  try {
    const reports = await prisma.report.findMany()
    return reports
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch reports' })
  }
})

