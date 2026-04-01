import prisma from '../../../lib/prisma'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, type, config, organizationId } = body || {}

  if (!name || !type || !organizationId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  try {
    const newReport = await prisma.report.create({
      data: { name, type, config, organizationId },
    })
    return newReport
  } catch (error: any) {
    console.error('Prisma error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
