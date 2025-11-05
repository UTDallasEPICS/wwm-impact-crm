import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.household.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Household not found' }
    }

    const household = await prisma.household.update({
      where: { id },
      data: {
        accountNumber: body?.accountNumber ?? undefined,
        name: body?.name ?? undefined,
        fullName: body?.fullName ?? undefined,
        informalName: body?.informalName ?? undefined,
        formalName: body?.formalName ?? undefined,
        envelopeName: body?.envelopeName ?? undefined,
        recognitionName: body?.recognitionName ?? undefined,
        sortName: body?.sortName ?? undefined,
        status: body?.status ?? undefined,
        headId: body?.headId ?? undefined,
      },
    })

    return { data: household }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (accountNumber)', details: err.meta }
    }
    return { error: 'Failed to update household', details: err }
  }
})
