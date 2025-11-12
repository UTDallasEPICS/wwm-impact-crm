import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { constituentId, amount, frequency } = body || {}
    if (!constituentId || amount === undefined || amount === null || !frequency) {
      event.node.res.statusCode = 400
      return { error: 'constituentId, amount, and frequency are required' }
    }

    const created = await prisma.recurringDonation.create({
      data: {
        constituentId,
        fundId: body?.fundId ?? null,
        designationId: body?.designationId ?? null,
        amount: Number(amount),
        frequency,
        startDate: body?.startDate ? new Date(body.startDate) : null,
        endDate: body?.endDate ? new Date(body.endDate) : null,
        note: body?.note ?? null,
        createdName: body?.createdName ?? null,
        lastModifiedName: body?.lastModifiedName ?? null,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? null,
      },
    })

    return { data: created }
  } catch (err) {
    return { error: 'Failed to create recurring donation', details: err }
  }
})
