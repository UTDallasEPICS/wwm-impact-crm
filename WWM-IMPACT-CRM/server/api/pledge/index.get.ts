import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const pledges = await prisma.pledge.findMany()
    return { data: pledges }
  } catch (err) {
    return { error: 'Failed to fetch pledges', details: err }
  }
})
