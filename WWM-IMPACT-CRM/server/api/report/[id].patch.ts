import prisma from '../../utils/prisma'
import { defineEventHandler, createError, getRouterParam, readBody} from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, type, config } = body || {}

  try {
    const updatedReport = await prisma.report.update({
      where: { id },
      data: { name, type, config },
    })
    return updatedReport
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})