import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.refund.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Refund not found' }
    }

    const updated = await prisma.refund.update({
      where: { id },
      data: {
        amount: body?.amount !== undefined ? Number(body.amount) : undefined,
        date: body?.date ? new Date(body.date) : undefined,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : new Date(),
        lastModifiedName: body?.lastModifiedName ?? undefined,
        note: body?.note ?? undefined,
        donationId: body?.donationId ?? undefined,
        constituentId: body?.constitituentId ?? body?.constituentId ?? undefined,
      },
    })

    return { data: updated }
  } catch (err) {
    return { error: 'Failed to update refund', details: err }
  }
})
