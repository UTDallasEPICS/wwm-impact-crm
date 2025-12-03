import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'id param is required' }
    }

    const b = (await readBody(event)) || {}

    const data: Record<string, any> = {}
    if (b.constituentId !== undefined) data.constituentId = String(b.constituentId)
    if (b.designationNumber !== undefined) data.designationNumber = b.designationNumber === null ? null : Number(b.designationNumber)

    if (b.creditCardType !== undefined) data.creditCardType = b.creditCardType?.trim?.() || (b.creditCardType === null ? null : undefined)
    if (b.creditCardNumberMasked !== undefined) data.creditCardNumberMasked = b.creditCardNumberMasked?.trim?.() || (b.creditCardNumberMasked === null ? null : undefined)
    if (b.creditCardExpiration !== undefined) data.creditCardExpiration = b.creditCardExpiration ? new Date(b.creditCardExpiration) : null

    if (b.eftAccountType !== undefined) data.eftAccountType = b.eftAccountType?.trim?.() || (b.eftAccountType === null ? null : undefined)
    if (b.eftAccountNumberMasked !== undefined) data.eftAccountNumberMasked = b.eftAccountNumberMasked?.trim?.() || (b.eftAccountNumberMasked === null ? null : undefined)
    if (b.eftRoutingNumberMasked !== undefined) data.eftRoutingNumberMasked = b.eftRoutingNumberMasked?.trim?.() || (b.eftRoutingNumberMasked === null ? null : undefined)

    if (b.paymentMethodToken !== undefined) data.paymentMethodToken = b.paymentMethodToken?.trim?.() || (b.paymentMethodToken === null ? null : undefined)

    if (!Object.keys(data).length) {
      setResponseStatus(event, 400)
      return { error: 'No updatable fields provided' }
    }

    const updated = await prismaAny.walletItem.update({ where: { id }, data })
    return { data: updated }
  } catch (e: any) {
    console.error('WalletItems [id].patch error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
