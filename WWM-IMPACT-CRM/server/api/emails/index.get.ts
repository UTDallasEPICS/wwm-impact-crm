import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const emails = await prisma.email.findMany()
    return { data: emails }
  } catch (err) {
    return { error: 'Failed to fetch emails', details: err }
  }
})
