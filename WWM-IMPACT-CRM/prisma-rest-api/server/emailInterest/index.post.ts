import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma
    const b = (await readBody(event)) || {}

    const name = b.name?.trim?.()
    if (!name) {
      setResponseStatus(event, 400)
      return { error: 'name is required' }
    }

    const isActive: boolean = typeof b.isActive === 'boolean' ? b.isActive : true

    const created = await prismaAny.emailInterest.create({
      data: { name, isActive },
    })
    setResponseStatus(event, 201)
    return { data: created }
  } catch (e: any) {
    console.error('EmailInterest index.post error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
