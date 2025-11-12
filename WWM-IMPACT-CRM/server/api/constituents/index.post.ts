import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const b = await readBody(event)

    if (!b?.accountNumber) {
      event.node.res.statusCode = 400
      return { error: 'accountNumber is required' }
    }

    const row = await prisma.constituent.create({
      data: {
        accountNumber: b.accountNumber,
        type: b?.type ?? null,
        status: b?.status ?? null,
        firstName: b?.firstName ?? null,
        middleName: b?.middleName ?? null,
        lastName: b?.lastName ?? null,
        fullName: b?.fullName ?? null,
        informalName: b?.informalName ?? null,
        formalName: b?.formalName ?? null,
        recognitionName: b?.recognitionName ?? null,
        sortName: b?.sortName ?? null,
        prefix: b?.prefix ?? null,
        suffix: b?.suffix ?? null,
        birthdate: b?.birthdate ? new Date(b.birthdate) : null,
        gender: b?.gender ?? null,
        jobTitle: b?.jobTitle ?? null,
        employer: b?.employer ?? null,
        website: b?.website ?? null,
        facebookId: b?.facebookId ?? null,
        twitterId: b?.twitterId ?? null,
        linkedInId: b?.linkedInId ?? null,
        envelopeName: b?.envelopeName ?? null,
        communicationChannelPreferred: b?.communicationChannelPreferred ?? null,
        emailInterestIsActive: b?.emailInterestIsActive ?? null,
        lastModifiedDate: b?.lastModifiedDate ? new Date(b.lastModifiedDate) : null,
        lastModifiedName: b?.lastModifiedName ?? null,
        createdDate: b?.createdDate ? new Date(b.createdDate) : undefined, // has default
        createdName: b?.createdName ?? null,
      },
    })

    return { data: row }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed (accountNumber)', details: err.meta }
    }
    return { error: 'Failed to create constituent', details: err }
  }
})
