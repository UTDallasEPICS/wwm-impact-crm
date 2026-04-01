import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { donationId } = body || {}
    if (!donationId) {
      event.node.res.statusCode = 400
      return { error: 'donationId is required' }
    }

    const created = await prisma.processingInfo.create({
      data: {
        donationId,
        token: body?.token ?? null,
        amount: body?.amount ?? null,
        transactionNumber: body?.transactionNumber ?? null,
        transactionProcessorAccountNumber: body?.transactionProcessorAccountNumber ?? null,
      },
    })

    return { data: created }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (donationId already has ProcessingInfo)', details: err.meta }
    }
    return { error: 'Failed to create processing info', details: err }
  }
})
