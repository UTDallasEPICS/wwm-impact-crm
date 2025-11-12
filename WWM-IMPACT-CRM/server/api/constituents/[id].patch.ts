import { defineEventHandler, readBody, getRouterParam } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const b = await readBody(event)

    const exists = await prisma.constituent.findUnique({ where: { id } })
    if (!exists) {
      event.node.res.statusCode = 404
      return { error: 'Constituent not found' }
    }

    const row = await prisma.constituent.update({
      where: { id },
      data: {
        accountNumber: b?.accountNumber ?? undefined,
        type: b?.type ?? undefined,
        status: b?.status ?? undefined,
        firstName: b?.firstName ?? undefined,
        middleName: b?.middleName ?? undefined,
        lastName: b?.lastName ?? undefined,
        fullName: b?.fullName ?? undefined,
        informalName: b?.informalName ?? undefined,
        formalName: b?.formalName ?? undefined,
        recognitionName: b?.recognitionName ?? undefined,
        sortName: b?.sortName ?? undefined,
        prefix: b?.prefix ?? undefined,
        suffix: b?.suffix ?? undefined,
        birthdate: b?.birthdate ? new Date(b.birthdate) : undefined,
        gender: b?.gender ?? undefined,
        jobTitle: b?.jobTitle ?? undefined,
        employer: b?.employer ?? undefined,
        website: b?.website ?? undefined,
        facebookId: b?.facebookId ?? undefined,
        twitterId: b?.twitterId ?? undefined,
        linkedInId: b?.linkedInId ?? undefined,
        envelopeName: b?.envelopeName ?? undefined,
        communicationChannelPreferred: b?.communicationChannelPreferred ?? undefined,
        emailInterestIsActive: b?.emailInterestIsActive ?? undefined,
        lastModifiedDate: b?.lastModifiedDate ? new Date(b.lastModifiedDate) : new Date(),
        lastModifiedName: b?.lastModifiedName ?? undefined,
        createdDate: b?.createdDate ? new Date(b.createdDate) : undefined,
        createdName: b?.createdName ?? undefined,
      },
    })

    return { data: row }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (accountNumber)', details: err.meta }
    }
    return { error: 'Failed to update constituent', details: err }
  }
})
