import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    await prisma.household.delete({ where: { id } })
    return { ok: true }
  } catch (err) {
    return { error: 'Failed to delete household', details: err }
  }
})
