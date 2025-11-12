import { defineEventHandler, readBody } from 'h3'
import prisma  from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // Minimal required fields based on your schema
    const { email, firstName, lastName, organizationId, constituentId } = body || {}

    if (!email || !firstName || !lastName || !organizationId || !constituentId) {
      event.node.res.statusCode = 400
      return { error: 'email, firstName, lastName, organizationId, and constituentId are required' }
    }

    const donor = await prisma.donor.create({
      data: {
        email,
        firstName,
        lastName,
        organizationId,
        constituentId,
        // donations: [] // created separately via Donation API, if any
      },
    })

    return { data: donor }
  } catch (err: any) {
    // Handle unique constraints: (organizationId, email) and constituentId unique
    if (err?.code === 'P2002') {
      event.node.res.statusCode = 409
      return { error: 'Unique constraint failed', details: err.meta }
    }
    return { error: 'Failed to create donor', details: err }
  }
})
