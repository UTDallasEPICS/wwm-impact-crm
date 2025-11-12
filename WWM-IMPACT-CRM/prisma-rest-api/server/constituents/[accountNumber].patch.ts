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
  } catch (e: any) {
    console.error('Constituents [accountNumber].patch error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
