import { defineEventHandler } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async () => {
  try {
    const tasks = await prisma.task.findMany()
    return { data: tasks }
  } catch (err) {
    return { error: 'Failed to fetch tasks', details: err }
  }
})
