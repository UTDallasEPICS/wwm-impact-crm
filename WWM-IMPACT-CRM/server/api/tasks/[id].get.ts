import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      event.node.res.statusCode = 404
      return { error: 'Task not found' }
    }
    return { data: task }
  } catch (err) {
    return { error: 'Failed to fetch task', details: err }
  }
})
