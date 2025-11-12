import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const appeal = await prisma.appeal.findUnique({ where: { id } })

    if (!appeal) {
      event.node.res.statusCode = 404
      return { error: 'Appeal not found' }
    }

    return { data: appeal }
  } catch (err) {
    return { error: 'Failed to fetch appeal', details: err }
  }
})
