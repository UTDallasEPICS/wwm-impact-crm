import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const b = (await readBody(event)) || {}

    const required: string[] = ['AccountNumber', 'First', 'Last']
    for (const f of required) {
      if (!b[f]) {
        setResponseStatus(event, 400)
        return { error: `${f} is required` }
      }
    }

    const now = new Date()
    const First = String(b.First).trim()
    const Last = String(b.Last).trim()
    const FullName = b.FullName?.trim?.() || `${First} ${Last}`
    const SortName = b.SortName?.trim?.() || `${Last}, ${First}`
    const InformalName = b.InformalName?.trim?.() || First
    const FormalName = b.FormalName?.trim?.() || FullName
    const EnvelopeName = b.EnvelopeName?.trim?.() || FullName
    const RecognitionName = b.RecognitionName?.trim?.() || FullName

    const created = await prismaAny.constituents.create({
      data: {
        AccountNumber: String(b.AccountNumber),
        CreatedDate: b.CreatedDate ? new Date(b.CreatedDate) : now,
        LastModifiedDate: b.LastModifiedDate ? new Date(b.LastModifiedDate) : now,
        CreatedName: b.CreatedName?.trim?.() || 'system',
        LastModifiedName: b.LastModifiedName?.trim?.() || 'system',

        SortName,
        RecognitionName,
        FullName,
        InformalName,
        FormalName,
        EnvelopeName,
        First,
        Last,

        CustomBirthYear: Number.isFinite(Number(b.CustomBirthYear)) ? Number(b.CustomBirthYear) : 0,
        CustomNetWorthDecile: Number.isFinite(Number(b.CustomNetWorthDecile)) ? Number(b.CustomNetWorthDecile) : 0,
        CustomIncomeDecile: Number.isFinite(Number(b.CustomIncomeDecile)) ? Number(b.CustomIncomeDecile) : 0,
        CustomRecurringId: b.CustomRecurringId ? String(b.CustomRecurringId) : '',

        Type: b.Type?.trim?.() || 'Individual',
        Status: b.Status?.trim?.() || 'Active',
        EmailInterestType: b.EmailInterestType?.trim?.() || '',
      },
    })
    setResponseStatus(event, 201)
    return { data: created }
  } catch (e: any) {
    console.error('Constituents index.post error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
