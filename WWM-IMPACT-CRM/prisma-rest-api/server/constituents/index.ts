import { defineEventHandler, getQuery, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

// Prefer prisma from Nitro context via @prisma/nuxt, fallback to local client in dev
const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma

    if (event.method === 'GET') {
      const q = getQuery(event)
      const skip = q.skip ? Number(q.skip) : undefined
      const take = q.take ? Number(q.take) : undefined
      const search = (q.search as string) || ''

      const where = search
        ? {
            OR: [
              { First: { contains: search, mode: 'insensitive' as const } },
              { Last: { contains: search, mode: 'insensitive' as const } },
              { FullName: { contains: search, mode: 'insensitive' as const } },
              { SortName: { contains: search, mode: 'insensitive' as const } },
              { RecognitionName: { contains: search, mode: 'insensitive' as const } },
              { InformalName: { contains: search, mode: 'insensitive' as const } },
              { FormalName: { contains: search, mode: 'insensitive' as const } },
              { EnvelopeName: { contains: search, mode: 'insensitive' as const } },
              { AccountNumber: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : undefined

      const data = await prismaAny.constituents.findMany({
        where,
        skip,
        take,
        orderBy: { SortName: 'asc' },
      })
      return { data }
    }

    if (event.method === 'POST') {
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
    }

    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  } catch (e: any) {
    console.error('Constituents index route error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
