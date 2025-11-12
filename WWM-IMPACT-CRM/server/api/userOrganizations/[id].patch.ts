import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.userOrganization.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'UserOrganization not found' }
    }

    const link = await prisma.userOrganization.update({
      where: { id },
      data: {
        userId: body?.userId ?? undefined,
        organizationId: body?.organizationId ?? undefined,
      },
    })

    return { data: link }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed for (userId, organizationId)', details: err.meta }
    }
    return { error: 'Failed to update user-organization', details: err }
  }
})
