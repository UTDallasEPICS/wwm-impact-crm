import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)

    const exists = await prisma.interaction.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Interaction not found' }
    }

    const interaction = await prisma.interaction.update({
      where: { id },
      data: {
        constituentId: body?.constituentId ?? undefined,
        subject: body?.subject ?? undefined,
        channel: body?.channel ?? undefined,
        type: body?.type ?? undefined,
        status: body?.status ?? undefined,
        date: body?.date ? new Date(body.date) : undefined,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? undefined,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : new Date(),
        lastModifiedName: body?.lastModifiedName ?? undefined,
        purpose: body?.purpose ?? undefined,
        readinessForAsk: body?.readinessForAsk ?? undefined,
        reasonForInterest: body?.reasonForInterest ?? undefined,
        invitedBy: body?.invitedBy ?? undefined,
        askers: body?.askers ?? undefined,
        askAmount: body?.askAmount ?? undefined,
        askByWhen: body?.askByWhen ? new Date(body.askByWhen) : undefined,
        teamLeader: body?.teamLeader ?? undefined,
        tableCaptains: body?.tableCaptains ?? undefined,
        levelsOfInterest: body?.levelsOfInterest ?? undefined,
        inbound: body?.inbound ?? undefined,
        note: body?.note ?? undefined,
      },
    })

    return { data: interaction }
  } catch (err) {
    return { error: 'Failed to update interaction', details: err }
  }
})
