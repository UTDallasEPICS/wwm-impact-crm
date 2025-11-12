import { defineEventHandler, readBody } from 'h3'
import prisma from '../../../lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { fieldId, entityType, entityId } = body || {}
    if (!fieldId || !entityType || !entityId) {
      event.node.res.statusCode = 400
      return { error: 'fieldId, entityType, and entityId are required' }
    }
    
    // pick a single value column based on client input
    const valueData: any = {
      valueString: body?.valueString ?? undefined,
      valueInt: body?.valueInt ?? undefined,
      valueFloat: body?.valueFloat ?? undefined,
      valueBool: body?.valueBool ?? undefined,
      valueDate: body?.valueDate ? new Date(body.valueDate) : undefined,
      valueJson: body?.valueJson ?? undefined,
    }

    const data = await prisma.customValue.upsert({
      where: {
        fieldId_entityType_entityId: { fieldId, entityType, entityId },
      },
      update: valueData,
      create: { fieldId, entityType, entityId, ...valueData },
      include: { field: true },
    })

    return { data }
  } catch (err) {
    return { error: 'Failed to upsert custom value', details: err }
  }
})
