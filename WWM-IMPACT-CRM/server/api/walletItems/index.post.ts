import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const b = (await readBody(event)) || {}

    if (!b.constituentId) {
      setResponseStatus(event, 400)
      return { error: 'constituentId is required' }
    }

    // Coerce fields
    const data: Record<string, any> = {
      constituentId: String(b.constituentId),
    }

    if (b.designationNumber !== undefined && b.designationNumber !== null) data.designationNumber = Number(b.designationNumber)
    if (b.creditCardType !== undefined) data.creditCardType = b.creditCardType?.trim?.() || null
    if (b.creditCardNumberMasked !== undefined) data.creditCardNumberMasked = b.creditCardNumberMasked?.trim?.() || null
    if (b.creditCardExpiration !== undefined) data.creditCardExpiration = b.creditCardExpiration ? new Date(b.creditCardExpiration) : null

    if (b.eftAccountType !== undefined) data.eftAccountType = b.eftAccountType?.trim?.() || null
    if (b.eftAccountNumberMasked !== undefined) data.eftAccountNumberMasked = b.eftAccountNumberMasked?.trim?.() || null
    if (b.eftRoutingNumberMasked !== undefined) data.eftRoutingNumberMasked = b.eftRoutingNumberMasked?.trim?.() || null

    if (b.paymentMethodToken !== undefined) data.paymentMethodToken = b.paymentMethodToken?.trim?.() || null

    const created = await prismaAny.walletItem.create({ data })
    setResponseStatus(event, 201)
    return { data: created }
  } catch (e: any) {
    console.error('WalletItems index.post error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
