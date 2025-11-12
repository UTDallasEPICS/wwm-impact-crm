import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.designation.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Designation not found' }
    }

    const designation = await prisma.designation.update({
      where: { id },
      data: {
        number: body?.number !== undefined ? Number(body.number) : undefined,
        name: body?.name ?? undefined,
      },
    })

    return { data: designation }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (number)', details: err.meta }
    }
    return { error: 'Failed to update designation', details: err }
  }
})
