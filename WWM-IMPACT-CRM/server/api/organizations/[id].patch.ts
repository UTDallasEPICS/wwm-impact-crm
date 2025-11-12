import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.organization.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Organization not found' }
    }

    const org = await prisma.organization.update({
      where: { id },
      data: { name: body?.name ?? exists.name },
    })

    return { data: org }
  } catch (err) {
    return { error: 'Failed to update organization', details: err }
  }
})
