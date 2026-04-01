import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.appeal.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Appeal not found' }
    }

    const appeal = await prisma.appeal.update({
      where: { id },
      data: {
        campaignId: body?.campaignId ?? undefined,
        name: body?.name ?? undefined,
      },
    })

    return { data: appeal }
  } catch (err) {
    return { error: 'Failed to update appeal', details: err }
  }
})
 