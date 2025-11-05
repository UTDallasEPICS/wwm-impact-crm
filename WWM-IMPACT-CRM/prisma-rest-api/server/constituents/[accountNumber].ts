import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const accountNumber = getRouterParam(event, 'accountNumber')
    if (!accountNumber) {
      setResponseStatus(event, 400)
      return { error: 'accountNumber param is required' }
    }

    if (event.method === 'GET') {
      const data = await prismaAny.constituents.findUnique({ where: { AccountNumber: accountNumber } })
      if (!data) {
        setResponseStatus(event, 404)
        return { error: 'Not found' }
      }
      return { data }
    }

    if (event.method === 'PUT' || event.method === 'PATCH') {
      const b = (await readBody(event)) || {}
      const allowed = [
        'First',
        'Last',
        'FullName',
        'SortName',
        'RecognitionName',
        'InformalName',
        'FormalName',
        'EnvelopeName',
        'Type',
        'Status',
        'EmailInterestType',
        'CreatedName',
        'LastModifiedName',
        'CustomBirthYear',
        'CustomNetWorthDecile',
        'CustomIncomeDecile',
        'CustomRecurringId',
      ]
      const data: Record<string, any> = {}
      for (const k of allowed) if (b[k] !== undefined) data[k] = b[k]
      data.LastModifiedDate = new Date()

      const updated = await prismaAny.constituents.update({
        where: { AccountNumber: accountNumber },
        data,
      })
      return { data: updated }
    }

    if (event.method === 'DELETE') {
      const existing = await prismaAny.constituents.findUnique({ where: { AccountNumber: accountNumber } })
      if (!existing) {
        setResponseStatus(event, 404)
        return { error: 'Not found' }
      }
      await prismaAny.constituents.delete({ where: { AccountNumber: accountNumber } })
      return { ok: true }
    }

    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  } catch (e: any) {
    console.error('Constituents id route error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
