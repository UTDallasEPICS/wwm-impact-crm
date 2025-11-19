import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
  // Use shared Prisma client
    const b = (await readBody(event)) || {}

    const required: string[] = ['donationId', 'creditedToId', 'amount']
    for (const f of required) {
      if (b[f] === undefined || b[f] === null || b[f] === '') {
        setResponseStatus(event, 400)
        return { error: `${f} is required` }
      }
    }

    const amount = Number(b.amount)
    if (!Number.isFinite(amount)) {
      setResponseStatus(event, 400)
      return { error: 'amount must be a number' }
    }

  const created = await prisma.softCredit.create({
      data: {
        donationId: String(b.donationId),
        creditedToId: String(b.creditedToId),
        amount,
        interactionId: b.interactionId ? String(b.interactionId) : undefined,
        designationNumber:
          b.designationNumber !== undefined && b.designationNumber !== null
            ? Number(b.designationNumber)
            : undefined,
        acknowledged: typeof b.acknowledged === 'boolean' ? b.acknowledged : undefined,
        reference:
          b.reference !== undefined && b.reference !== null ? Number(b.reference) : undefined,
        note: b.note?.trim?.() || undefined,
        createdName: b.createdName?.trim?.() || 'system',
        lastModifiedName: b.lastModifiedName?.trim?.() || 'system',
        // createdDate defaults to now via Prisma; allow override if provided
        createdDate: b.createdDate ? new Date(b.createdDate) : undefined,
        lastModifiedDate: b.lastModifiedDate ? new Date(b.lastModifiedDate) : undefined,
      },
    })
    setResponseStatus(event, 201)
    return { data: created }
  } catch (e: any) {
    console.error('SoftCredits index.post error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
