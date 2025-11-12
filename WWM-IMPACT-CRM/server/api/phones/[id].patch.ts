import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.phone.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Phone not found' }
    }

    const phone = await prisma.phone.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        type: body?.type ?? undefined,
        number: body?.number ?? undefined,
        extension: body?.extension ?? undefined,
        isPrimary: body?.isPrimary ?? undefined,
      },
    })

    return { data: phone }
  } catch (err) {
    return { error: 'Failed to update phone', details: err }
  }
})
