import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { constituentId } = body || {}
    if (!constituentId) {
      event.node.res.statusCode = 400
      return { error: 'constituentId is required' }
    }

    const interaction = await prisma.interaction.create({
      data: {
        constituentId,
        subject: body?.subject ?? null,
        channel: body?.channel ?? null,
        type: body?.type ?? null,
        status: body?.status ?? null,
        date: body?.date ? new Date(body.date) : null,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined,
        createdName: body?.createdName ?? null,
        lastModifiedDate: body?.lastModifiedDate ? new Date(body.lastModifiedDate) : null,
        lastModifiedName: body?.lastModifiedName ?? null,
        purpose: body?.purpose ?? null,
        readinessForAsk: body?.readinessForAsk ?? null,
        reasonForInterest: body?.reasonForInterest ?? null,
        invitedBy: body?.invitedBy ?? null,
        askers: body?.askers ?? null,
        askAmount: body?.askAmount ?? null,
        askByWhen: body?.askByWhen ? new Date(body.askByWhen) : null,
        teamLeader: body?.teamLeader ?? null,
        tableCaptains: body?.tableCaptains ?? null,
        levelsOfInterest: body?.levelsOfInterest ?? null,
        inbound: body?.inbound ?? null,
        note: body?.note ?? null,
      },
    })

    return { data: interaction }
  } catch (err) {
    return { error: 'Failed to create interaction', details: err }
  }
})
