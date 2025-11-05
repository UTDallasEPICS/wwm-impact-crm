import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.processingInfo.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'ProcessingInfo not found' }
    }

    const updated = await prisma.processingInfo.update({
      where: { id },
      data: {
        donationId: body?.donationId ?? undefined,
        token: body?.token ?? undefined,
        amount: body?.amount ?? undefined,
        transactionNumber: body?.transactionNumber ?? undefined,
        transactionProcessorAccountNumber: body?.transactionProcessorAccountNumber ?? undefined,
      },
    })

    return { data: updated }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (donationId)', details: err.meta }
    }
    return { error: 'Failed to update processing info', details: err }
  }
})
