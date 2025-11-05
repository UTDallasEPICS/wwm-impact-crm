import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.recurringDonationPayment.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'RecurringDonationPayment not found' }
    }

    const updated = await prisma.recurringDonationPayment.update({
      where: { id },
      data: {
        recurringId: body?.recurringId ?? undefined,
        donationId: body?.donationId ?? undefined,
        transactionNumber: body?.transactionNumber ?? undefined,
        amount: body?.amount !== undefined ? Number(body.amount) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedName: body?.lastModifiedName ?? undefined,
        nonDeductible: body?.nonDeductible ?? undefined,
        referenceDesignationNumber: body?.referenceDesignationNumber ?? undefined,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? undefined,
        note: body?.note ?? undefined,
      },
    })

    return { data: updated }
  } catch (err) {
    return { error: 'Failed to update recurring donation payment', details: err }
  }
})
