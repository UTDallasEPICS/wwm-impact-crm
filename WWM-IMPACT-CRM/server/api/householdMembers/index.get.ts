import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const members = await prisma.householdMember.findMany()
    return { data: members }
  } catch (err) {
    return { error: 'Failed to fetch household members', details: err }
  }
})
