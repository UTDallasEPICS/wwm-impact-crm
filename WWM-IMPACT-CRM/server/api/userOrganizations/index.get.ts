import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const links = await prisma.userOrganization.findMany()
    return { data: links }
  } catch (err) {
    return { error: 'Failed to fetch user-organizations', details: err }
  }
})
