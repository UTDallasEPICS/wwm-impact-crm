import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const email = await prisma.email.findUnique({ where: { id } })

    if (!email) {
      event.node.res.statusCode = 404
      return { error: 'Email not found' }
    }

    return { data: email }
  } catch (err) {
    return { error: 'Failed to fetch email', details: err }
  }
})
