import prisma from '../../utils/prisma'
import { defineEventHandler, createError, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, goal, startDate, endDate, isActive } = body || {}

    // Basic validation
    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        name,
        goal: goal || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return newCampaign
  } catch (error: any) {
    console.error('Prisma error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
