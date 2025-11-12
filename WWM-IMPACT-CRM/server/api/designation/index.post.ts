import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { number, name } = body || {}

    if (number === undefined || number === null) {
      event.node.res.statusCode = 400
      return { error: 'number is required' }
    }

    const designation = await prisma.designation.create({
      data: { number: Number(number), name: name ?? null },
    })

    return { data: designation }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (number)', details: err.meta }
    }
    return { error: 'Failed to create designation', details: err }
  }
})
