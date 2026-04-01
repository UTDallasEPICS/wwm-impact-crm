import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    if (!body?.name) {
      event.node.res.statusCode = 400
      return { error: 'name is required' }
    }

    const task = await prisma.task.create({
      data: {
        constituentId: body?.constituentId ?? null,
        name: body.name,
        notes: body?.notes ?? null,
        note: body?.note ?? null,
        shouldApplySoftCredit: body?.shouldApplySoftCredit ?? false,
        status: body?.status ?? null,
        eventStatus: body?.eventStatus ?? null,
        eventType: body?.eventType ?? null,
        purpose: body?.purpose ?? null,
        subject: body?.subject ?? null,
        ambassador: body?.ambassador ?? null,
        askers: body?.askers ?? null,
        askAmount: body?.askAmount ?? null,
        buckets: body?.buckets ?? null,
        channel: body?.channel ?? null,
        invitedBy: body?.invitedBy ?? null,
        levelsOfInterest: body?.levelsOfInterest ?? null,
        readinessForAsk: body?.readinessForAsk ?? null,
        teamLeader: body?.teamLeader ?? null,
        tableCaptains: body?.tableCaptains ?? null,
        isActive: body?.isActive ?? true,
        userName: body?.userName ?? null,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? null,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : null,
        lastModifiedName: body?.lastModifiedName ?? null,
        completedDate: body?.completedDate ? new Date(body.completedDate) : null,
        date: body?.date ? new Date(body.date) : null,
      },
    })

    return { data: task }
  } catch (err) {
    return { error: 'Failed to create task', details: err }
  }
})
