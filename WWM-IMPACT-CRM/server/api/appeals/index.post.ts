import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { campaignId, name } = body || {}

    if (!campaignId || !name) {
      event.node.res.statusCode = 400
      return { error: 'campaignId and name are required' }
    }

    const appeal = await prisma.appeal.create({
      data: { campaignId, name },
    })

    return { data: appeal }
  } catch (err) {
    return { error: 'Failed to create appeal', details: err }
  }
})
