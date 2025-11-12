import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { pledgeId, amount } = body || {}

    if (!pledgeId || amount === undefined || amount === null) {
      event.node.res.statusCode = 400
      return { error: 'pledgeId and amount are required' }
    }

    const created = await prisma.pledgePayment.create({
      data: {
        pledgeId,
        donationId: body?.donationId ?? null,
        transactionNumber: body?.transactionNumber ?? null,
        amount: Number(amount),
        createdName: body?.createdName ?? null,
        lastModifiedName: body?.lastModifiedName ?? null,
        nonDeductible: body?.nonDeductible ?? null,
        referenceDesignationNumber: body?.referenceDesignationNumber ?? null,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? null,
        checkDate: body?.checkDate ? new Date(body.checkDate) : null,
        checkNumber: body?.checkNumber ?? null,
        note: body?.note ?? null,
      },
    })

    return { data: created }
  } catch (err) {
    return { error: 'Failed to create pledge payment', details: err }
  }
})
