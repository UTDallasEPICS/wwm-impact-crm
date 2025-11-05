import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.email.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Email not found' }
    }

    const email = await prisma.email.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        type: body?.type ?? undefined,
        value: body?.value ?? undefined,
        isPrimary: body?.isPrimary ?? undefined,
        isBad: body?.isBad ?? undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedName: body?.lastModifiedName ?? undefined,
      },
    })

    return { data: email }
  } catch (err) {
    return { error: 'Failed to update email', details: err }
  }
})
