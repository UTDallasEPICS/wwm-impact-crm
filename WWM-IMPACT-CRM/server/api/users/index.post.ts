import { defineEventHandler, readBody } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const user = await prisma.user.create({
      data: {
        ...body,
        createdDate: body.createdDate ? new Date(body.createdDate) : new Date(),
        lastModifiedDate: body.lastModifiedDate ? new Date(body.lastModifiedDate) : new Date(),
      },
    })

    return { data: user }
  } catch (err) {
    return { error: 'Failed to create user', details: err }
  }
})
