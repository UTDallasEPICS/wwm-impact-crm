import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const designation = await prisma.designation.findUnique({ where: { id } })

    if (!designation) {
      event.node.res.statusCode = 404
      return { error: 'Designation not found' }
    }

    return { data: designation }
  } catch (err) {
    return { error: 'Failed to fetch designation', details: err }
  }
})
