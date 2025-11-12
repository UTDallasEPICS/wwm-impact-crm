import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { constituentId, number } = body || {}

    if (!constituentId || !number) {
      event.node.res.statusCode = 400
      return { error: 'constituentId and number are required' }
    }

    const phone = await prisma.phone.create({
      data: {
        constituentId,
        number,
        type: body?.type ?? null,
        extension: body?.extension ?? null,
        isPrimary: body?.isPrimary ?? false,
      },
    })

    return { data: phone }
  } catch (err) {
    return { error: 'Failed to create phone', details: err }
  }
})
