import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { amount, donorId, constituentId } = body || {}

    if (amount == null || donorId == null || constituentId == null) {
      event.node.res.statusCode = 400
      return { error: 'amount, donorId, and constituentId are required' }
    }

    const donation = await prisma.donation.create({
      data: {
        transactionNumber: body?.transactionNumber ?? null,
        amount: Number(amount),
        nonDeductible: body?.nonDeductible ?? null,
        method: body?.method ?? null,
        inKindType: body?.inKindType ?? null,
        inKindDescription: body?.inKindDescription ?? null,
        inKindMarketValue: body?.inKindMarketValue ?? null,
        checkDate: body?.checkDate ? new Date(body.checkDate) : null,
        checkNumber: body?.checkNumber ?? null,
        date: body?.date ? new Date(body.date) : null,

        campaignId: body?.campaignId ?? null,
        appealId: body?.appealId ?? null,
        fundId: body?.fundId ?? null,
        designationId: body?.designationId ?? null,
        donorId,
        interactionLinkId: body?.interactionLinkId ?? null,
        tributeId: body?.tributeId ?? null,
        processorAccountId: body?.processorAccountId ?? null,
        constituentId,

        acknowledgmentStatus: body?.acknowledgmentStatus ?? null,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? null,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : null,
        lastModifiedName: body?.lastModifiedName ?? null,
        note: body?.note ?? null,
        isCompanyMatch: body?.isCompanyMatch ?? false,

        paymentToken: body?.paymentToken ?? null,
      },
    })

    return { data: donation }
  } catch (err: any) {
    // Optional: handle common Prisma errors
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (transactionNumber)', details: err.meta }
    }
    if (err?.code === 'P2003') {
      event.node.res.statusCode = 400
      return { error: 'Foreign key constraint failed on related IDs', details: err.meta }
    }
    return { error: 'Failed to create donation', details: err }
  }
})
