import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { constituentId, value } = body || {}

    if (!constituentId || !value) {
      event.node.res.statusCode = 400
      return { error: 'constituentId and value are required' }
    }

    const email = await prisma.email.create({
      data: {
        constituentId,
        value,
        type: body?.type ?? null,
        isPrimary: body?.isPrimary ?? false,
        isBad: body?.isBad ?? false,
        createdName: body?.createdName ?? null,
        lastModifiedName: body?.lastModifiedName ?? null,
      },
    })

    return { data: email }
  } catch (err) {
    return { error: 'Failed to create email', details: err }
  }
})
