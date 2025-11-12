import { defineEventHandler, getRouterParam } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      event.node.res.statusCode = 404
      return { error: 'User not found' }
    }

    return { data: user }
  } catch (err) {
    return { error: 'Failed to fetch user', details: err }
  }
})
