import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.recurringDonation.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'RecurringDonation not found' }
    }

    const updated = await prisma.recurringDonation.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        fundId: body?.fundId ?? undefined,
        designationId: body?.designationId ?? undefined,
        amount: body?.amount !== undefined ? Number(body.amount) : undefined,
        frequency: body?.frequency ?? undefined,
        startDate: body?.startDate ? new Date(body.startDate) : undefined,
        endDate: body?.endDate ? new Date(body.endDate) : undefined,
        note: body?.note ?? undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedName: body?.lastModifiedName ?? undefined,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? undefined,
      },
    })

    return { data: updated }
  } catch (err) {
    return { error: 'Failed to update recurring donation', details: err }
  }
})
