import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const org = await prisma.organization.findUnique({ where: { id } })

    if (!org) {
      event.node.res.statusCode = 404
      return { error: 'Organization not found' }
    }

    return { data: org }
  } catch (err) {
    return { error: 'Failed to fetch organization', details: err }
  }
})
