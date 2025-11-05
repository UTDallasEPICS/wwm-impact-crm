import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const orgs = await prisma.organization.findMany()
    return { data: orgs }
  } catch (err) {
    return { error: 'Failed to fetch organizations', details: err }
  }
})
