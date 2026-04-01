import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    await prisma.donation.delete({ where: { id } })
    return { ok: true }
  } catch (err: any) {
    if (err?.code === 'P2003') {
      event.node.res.statusCode = 400
      return { error: 'Cannot delete donation due to related records', details: err.meta }
    }
    return { error: 'Failed to delete donation', details: err }
  }
})
