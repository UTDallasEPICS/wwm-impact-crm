import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.donation.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Donation not found' }
    }

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        transactionNumber: body?.transactionNumber ?? undefined,
        amount: body?.amount != null ? Number(body.amount) : undefined,
        nonDeductible: body?.nonDeductible ?? undefined,
        method: body?.method ?? undefined,
        inKindType: body?.inKindType ?? undefined,
        inKindDescription: body?.inKindDescription ?? undefined,
        inKindMarketValue: body?.inKindMarketValue ?? undefined,
        checkDate: body?.checkDate ? new Date(body.checkDate) : undefined,
        checkNumber: body?.checkNumber ?? undefined,
        date: body?.date ? new Date(body.date) : undefined,

        campaignId: body?.campaignId ?? undefined,
        appealId: body?.appealId ?? undefined,
        fundId: body?.fundId ?? undefined,
        designationId: body?.designationId ?? undefined,
        donorId: body?.donorId ?? undefined,
        interactionLinkId: body?.interactionLinkId ?? undefined,
        tributeId: body?.tributeId ?? undefined,
        processorAccountId: body?.processorAccountId ?? undefined,
        constituentId: body?.constituentId ?? undefined,

        acknowledgmentStatus: body?.acknowledgmentStatus ?? undefined,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedDate: body?.lastModifiedDate
          ? new Date(body.lastModifiedDate)
          : new Date(),
        lastModifiedName: body?.lastModifiedName ?? undefined,
        note: body?.note ?? undefined,
        isCompanyMatch: body?.isCompanyMatch ?? undefined,

        paymentToken: body?.paymentToken ?? undefined,
      },
    })

    return { data: donation }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (transactionNumber)', details: err.meta }
    }
    if (err?.code === 'P2003') {
      event.node.res.statusCode = 400
      return { error: 'Foreign key constraint failed on related IDs', details: err.meta }
    }
    return { error: 'Failed to update donation', details: err }
  }
})
