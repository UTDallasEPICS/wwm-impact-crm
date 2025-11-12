import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.donor.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Donor not found' }
    }

    const donor = await prisma.donor.update({
      where: { id },
      data: {
        // Allow partial updates; only include what was sent
        email: body?.email ?? undefined,
        firstName: body?.firstName ?? undefined,
        lastName: body?.lastName ?? undefined,
        organizationId: body?.organizationId ?? undefined,
        constituentId: body?.constituentId ?? undefined,
      },
    })

    return { data: donor }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed', details: err.meta }
    }
    return { error: 'Failed to update donor', details: err }
  }
})
