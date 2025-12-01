import prisma from '../../../lib/prisma'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, isActive, isDefault, organizationId } = body || {}

        if (!name || !organizationId) {
            throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
        }

        const newFund = await prisma.fund.create({
            data: {
                name,
                isActive: isActive !== undefined ? isActive : true,
                isDefault: isDefault !== undefined ? isDefault : false,
                organization: {
                    connect: { id: organizationId }
                }
            }
        })

        return newFund
    } catch (error: any) {
        console.error('Prisma error:', error)
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
})
