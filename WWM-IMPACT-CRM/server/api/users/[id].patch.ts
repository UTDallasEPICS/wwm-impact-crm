import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.user.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'User not found' }
    }

    const user = await prisma.user.update({
      where: { id },
      data: { ...body, lastModifiedDate: new Date() },
    })

    return { data: user }
  } catch (err) {
    return { error: 'Failed to update user', details: err }
  }
})
