import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.customValue.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'CustomValue not found' }
    }

    const updated = await prisma.customValue.update({
      where: { id },
      data: {
        valueString: body?.valueString ?? undefined,
        valueInt: body?.valueInt ?? undefined,
        valueFloat: body?.valueFloat ?? undefined,
        valueBool: body?.valueBool ?? undefined,
        valueDate: body?.valueDate ? new Date(body.valueDate) : undefined,
        valueJson: body?.valueJson ?? undefined,
      },
      include: { field: true },
    })

    return { data: updated }
  } catch (err) {
    return { error: 'Failed to update custom value', details: err }
  }
})
