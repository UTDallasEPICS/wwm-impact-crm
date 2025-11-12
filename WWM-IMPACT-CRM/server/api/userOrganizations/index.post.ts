import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, organizationId } = body || {}

    if (!userId || !organizationId) {
      event.node.res.statusCode = 400
      return { error: 'userId and organizationId are required' }
    }

    const link = await prisma.userOrganization.create({
      data: { userId, organizationId },
    })

    return { data: link }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed for (userId, organizationId)', details: err.meta }
    }
    return { error: 'Failed to create user-organization link', details: err }
  }
})
