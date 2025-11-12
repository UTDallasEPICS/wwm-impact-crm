import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const fields = await prisma.customField.findMany()
    return { data: fields }
  } catch (err) {
    return { error: 'Failed to fetch custom fields', details: err }
  }
})
