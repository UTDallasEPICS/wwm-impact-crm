import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.task.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Task not found' }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        name: body?.name ?? undefined,
        notes: body?.notes ?? undefined,
        note: body?.note ?? undefined,
        shouldApplySoftCredit: body?.shouldApplySoftCredit ?? undefined,
        status: body?.status ?? undefined,
        eventStatus: body?.eventStatus ?? undefined,
        eventType: body?.eventType ?? undefined,
        purpose: body?.purpose ?? undefined,
        subject: body?.subject ?? undefined,
        ambassador: body?.ambassador ?? undefined,
        askers: body?.askers ?? undefined,
        askAmount: body?.askAmount ?? undefined,
        buckets: body?.buckets ?? undefined,
        channel: body?.channel ?? undefined,
        invitedBy: body?.invitedBy ?? undefined,
        levelsOfInterest: body?.levelsOfInterest ?? undefined,
        readinessForAsk: body?.readinessForAsk ?? undefined,
        teamLeader: body?.teamLeader ?? undefined,
        tableCaptains: body?.tableCaptains ?? undefined,
        isActive: body?.isActive ?? undefined,
        userName: body?.userName ?? undefined,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : new Date(),
        lastModifiedName: body?.lastModifiedName ?? undefined,
        completedDate: body?.completedDate ? new Date(body.completedDate) : undefined,
        date: body?.date ? new Date(body.date) : undefined,
      },
    })

    return { data: task }
  } catch (err) {
    return { error: 'Failed to update task', details: err }
  }
})
