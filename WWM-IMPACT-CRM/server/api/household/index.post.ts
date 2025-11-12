import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { accountNumber } = body || {}

    if (!accountNumber) {
      event.node.res.statusCode = 400
      return { error: 'accountNumber is required' }
    }

    const household = await prisma.household.create({
      data: {
        accountNumber,
        name: body?.name ?? null,
        fullName: body?.fullName ?? null,
        informalName: body?.informalName ?? null,
        formalName: body?.formalName ?? null,
        envelopeName: body?.envelopeName ?? null,
        recognitionName: body?.recognitionName ?? null,
        sortName: body?.sortName ?? null,
        status: body?.status ?? null,
        headId: body?.headId ?? null, // optional pointer to a member (store string id)
      },
    })

    return { data: household }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (accountNumber)', details: err.meta }
    }
    return { error: 'Failed to create household', details: err }
  }
})
