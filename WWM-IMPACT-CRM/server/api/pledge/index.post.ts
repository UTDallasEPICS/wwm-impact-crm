import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { constituentId, amount, frequency, firstInstallmentDate } = body || {}

    if (!constituentId || amount === undefined || amount === null || !frequency || !firstInstallmentDate) {
      event.node.res.statusCode = 400
      return { error: 'constituentId, amount, frequency, and firstInstallmentDate are required' }
    }

    const created = await prisma.pledge.create({
      data: {
        constituentId,
        fundId: body?.fundId ?? null,
        amount: Number(amount),
        frequency, // enum string from client
        firstInstallmentDate: new Date(firstInstallmentDate),
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined, // default exists
        createdName: body?.createdName ?? null,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : null,
        lastModifiedName: body?.lastModifiedName ?? null,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? null,
        note: body?.note ?? null,
      },
    })

    return { data: created }
  } catch (err) {
    return { error: 'Failed to create pledge', details: err }
  }
})
