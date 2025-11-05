import { defineEventHandler } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const users = await prisma.user.findMany()
    return { data: users }
  } catch (err) {
    return { error: 'Failed to fetch users', details: err }
  }
})
