import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { recurringId, amount } = body || {}

    if (!recurringId || amount === undefined || amount === null) {
      event.node.res.statusCode = 400
      return { error: 'recurringId and amount are required' }
    }

    const created = await prisma.recurringDonationPayment.create({
      data: {
        recurringId,
        donationId: body?.donationId ?? null,
        transactionNumber: body?.transactionNumber ?? null,
        amount: Number(amount),
        createdName: body?.createdName ?? null,
        lastModifiedName: body?.lastModifiedName ?? null,
        nonDeductible: body?.nonDeductible ?? null,
        referenceDesignationNumber: body?.referenceDesignationNumber ?? null,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? null,
        note: body?.note ?? null,
      },
    })

    return { data: created }
  } catch (err) {
    return { error: 'Failed to create recurring donation payment', details: err }
  }
})
