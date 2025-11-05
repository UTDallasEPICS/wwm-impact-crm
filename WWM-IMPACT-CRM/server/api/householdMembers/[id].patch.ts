import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.householdMember.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'HouseholdMember not found' }
    }

    const member = await prisma.householdMember.update({
      where: { id },
      data: {
        householdId: body?.householdId ?? undefined,
        constituentId: body?.constituentId ?? undefined,
        role: body?.role ?? undefined,
      },
    })

    return { data: member }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (householdId, constituentId)', details: err.meta }
    }
    return { error: 'Failed to update household member', details: err }
  }
})
