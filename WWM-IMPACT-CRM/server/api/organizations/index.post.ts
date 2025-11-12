import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body?.name) {
      event.node.res.statusCode = 400
      return { error: 'name is required' }
    }

    const org = await prisma.organization.create({
      data: { name: body.name },
    })

    return { data: org }
  } catch (err) {
    return { error: 'Failed to create organization', details: err }
  }
})
