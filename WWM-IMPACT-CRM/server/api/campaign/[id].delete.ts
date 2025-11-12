import prisma from '../../utils/prisma'
import { defineEventHandler, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    try {
        const campaign = await prisma.campaign.findUnique({ where: { id } })
        if (!campaign) {
            throw createError({ statusCode: 404, statusMessage: 'Campaign not found' })
        }
        return campaign
    } catch (error: any) {
        console.error(error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch campaign' })
    }
})