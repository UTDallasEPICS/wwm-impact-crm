import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { householdId, constituentId, role } = body || {}

    if (!householdId || !constituentId) {
      event.node.res.statusCode = 400
      return { error: 'householdId and constituentId are required' }
    }

    const member = await prisma.householdMember.create({
      data: { householdId, constituentId, role: role ?? null },
    })

    return { data: member }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (householdId, constituentId)', details: err.meta }
    }
    return { error: 'Failed to add household member', details: err }
  }
})
