import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.pledge.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Pledge not found' }
    }

    const updated = await prisma.pledge.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        fundId: body?.fundId ?? undefined,
        amount: body?.amount !== undefined ? Number(body.amount) : undefined,
        frequency: body?.frequency ?? undefined,
        firstInstallmentDate: body?.firstInstallmentDate ? new Date(body.firstInstallmentDate) : undefined,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : new Date(),
        lastModifiedName: body?.lastModifiedName ?? undefined,
        acknowledgmentStatus: body?.acknowledgmentStatus ?? undefined,
        note: body?.note ?? undefined,
      },
    })

    return { data: updated }
  } catch (err) {
    return { error: 'Failed to update pledge', details: err }
  }
})
