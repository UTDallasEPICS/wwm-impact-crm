import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const link = await prisma.userOrganization.findUnique({ where: { id } })

    if (!link) {
      event.node.res.statusCode = 404
      return { error: 'UserOrganization not found' }
    }

    return { data: link }
  } catch (err) {
    return { error: 'Failed to fetch user-organization', details: err }
  }
})
