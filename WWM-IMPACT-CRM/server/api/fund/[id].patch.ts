import prisma from '../../utils/prisma'
import { defineEventHandler, createError, getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, isActive, isDefault } = body || {}

  try {
    const updatedFund = await prisma.fund.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
      },
    })

    return updatedFund
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
