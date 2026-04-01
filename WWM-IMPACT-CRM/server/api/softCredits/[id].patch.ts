import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
  // Use shared Prisma client
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

    const b = (await readBody(event)) || {}

    const data: Record<string, any> = {}
    if (b.donationId !== undefined) data.donationId = String(b.donationId)
    if (b.creditedToId !== undefined) data.creditedToId = String(b.creditedToId)
    if (b.amount !== undefined) {
      const amount = Number(b.amount)
      if (!Number.isFinite(amount)) {
        setResponseStatus(event, 400)
        return { error: 'amount must be a number' }
      }
      data.amount = amount
    }
    if (b.interactionId !== undefined) data.interactionId = b.interactionId ? String(b.interactionId) : null
    if (b.designationNumber !== undefined) data.designationNumber = b.designationNumber === null ? null : Number(b.designationNumber)
    if (b.acknowledged !== undefined) data.acknowledged = Boolean(b.acknowledged)
    if (b.reference !== undefined) data.reference = b.reference === null ? null : Number(b.reference)
    if (b.note !== undefined) data.note = b.note?.trim?.() || (b.note === null ? null : undefined)
    if (b.createdName !== undefined) data.createdName = b.createdName?.trim?.()
    if (b.lastModifiedName !== undefined) data.lastModifiedName = b.lastModifiedName?.trim?.()
    if (b.createdDate !== undefined) data.createdDate = b.createdDate ? new Date(b.createdDate) : null

    // Always bump lastModifiedDate on mutation
    data.lastModifiedDate = new Date()

    if (!Object.keys(data).length) {
      setResponseStatus(event, 400)
      return { error: 'No updatable fields provided' }
    }

  const updated = await prisma.softCredit.update({ where: { id }, data })
    return { data: updated }
  } catch (e: any) {
    console.error('SoftCredits [id].patch error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
