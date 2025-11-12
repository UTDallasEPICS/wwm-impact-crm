import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const interactions = await prisma.interaction.findMany()
    return { data: interactions }
  } catch (err) {
    return { error: 'Failed to fetch interactions', details: err }
  }
})
