import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const interaction = await prisma.interaction.findUnique({ where: { id } })
    if (!interaction) {
      event.node.res.statusCode = 404
      return { error: 'Interaction not found' }
    }
    return { data: interaction }
  } catch (err) {
    return { error: 'Failed to fetch interaction', details: err }
  }
})
