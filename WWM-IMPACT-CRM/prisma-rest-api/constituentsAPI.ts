import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

// Helper to coerce numeric ints with default
const toInt = (v: any, d = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

// POST /constituents - create a new constituent (Constituent model)
router.post('/constituents', async (req, res) => {
  try {
    const b = req.body || {}

    // Minimal required inputs; most columns are optional in this schema
    const firstName = b.firstName?.trim()
    const lastName = b.lastName?.trim()

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'firstName and lastName are required' })
    }

    const now = new Date()
    const accountNumber: string | undefined = b.accountNumber ? String(b.accountNumber) : undefined

    if (!accountNumber) {
      return res.status(400).json({ error: 'accountNumber is required' })
    }
    const fullName = b.fullName?.trim() || `${firstName} ${lastName}`
    const sortName = b.sortName?.trim() || `${lastName}, ${firstName}`
    const informalName = b.informalName?.trim() || firstName
    const formalName = b.formalName?.trim() || fullName
    const envelopeName = b.envelopeName?.trim() || fullName
    const recognitionName = b.recognitionName?.trim() || fullName

  const created = await prisma.constituent.create({
      data: {
    // id is default uuid(); accountNumber is required in schema
    accountNumber,

        createdDate: b.createdDate ? new Date(b.createdDate) : now,
        lastModifiedDate: b.lastModifiedDate ? new Date(b.lastModifiedDate) : now,
        createdName: b.createdName?.trim() || 'system',
        lastModifiedName: b.lastModifiedName?.trim() || 'system',

        sortName,
        recognitionName,
        fullName,
        informalName,
        formalName,
        envelopeName,
        firstName,
        lastName,

        // Optionals
        middleName: b.middleName?.trim() || null,
        prefix: b.prefix?.trim() || null,
        suffix: b.suffix?.trim() || null,
        birthdate: b.birthdate ? new Date(b.birthdate) : null,
        jobTitle: b.jobTitle?.trim() || null,
        employer: b.employer?.trim() || null,
        website: b.website?.trim() || null,
        facebookId: b.facebookId?.trim() || null,
        twitterId: b.twitterId?.trim() || null,
        linkedInId: b.linkedInId?.trim() || null,

        type: b.type?.trim() || 'Individual',
        status: b.status?.trim() || 'Active',
        communicationChannelPreferred: b.communicationChannelPreferred?.trim() || null,
        emailInterestIsActive: b.emailInterestIsActive ?? null,
      },
    })

    res.status(201).json(created)
  } catch (error: any) {
    console.error('Error creating constituent:', error)
    res.status(500).json({ error: error?.message || 'Failed to create constituent' })
  }
})

// GET /constituents - list with optional pagination and search
router.get('/constituents', async (req, res) => {
  try {
    const { skip, take, search } = req.query as Record<string, string>
    const s = (search || '').trim()
    const where = s
      ? {
          OR: [
      { firstName: { contains: s, mode: 'insensitive' as const } },
      { lastName: { contains: s, mode: 'insensitive' as const } },
      { fullName: { contains: s, mode: 'insensitive' as const } },
      { sortName: { contains: s, mode: 'insensitive' as const } },
      { recognitionName: { contains: s, mode: 'insensitive' as const } },
      { informalName: { contains: s, mode: 'insensitive' as const } },
      { formalName: { contains: s, mode: 'insensitive' as const } },
      { envelopeName: { contains: s, mode: 'insensitive' as const } },
      { accountNumber: { contains: s, mode: 'insensitive' as const } },
          ],
        }
      : undefined

    const items = await prisma.constituent.findMany({
      where,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      orderBy: { sortName: 'asc' },
    })

    res.json(items)
  } catch (error: any) {
    console.error('Error fetching constituents:', error)
    res.status(500).json({ error: 'Failed to fetch constituents' })
  }
})

// GET /constituents/:id - fetch by id (primary key)
router.get('/constituents/:id', async (req, res) => {
  const { id } = req.params
  try {
  const item = await prisma.constituent.findUnique({ where: { id } })
    if (!item) return res.status(404).json({ error: 'Constituent not found' })
    res.json(item)
  } catch (error: any) {
    console.error('Error fetching constituent:', error)
    res.status(500).json({ error: 'Failed to fetch constituent' })
  }
})

// PUT /constituents/:id - update allowed fields, bump last modified
router.put('/constituents/:id', async (req, res) => {
  const { id } = req.params
  const b = req.body || {}
  try {
    // Ensure exists
    const exists = await prisma.constituent.findUnique({ where: { id } })
    if (!exists) return res.status(404).json({ error: 'Constituent not found' })

    const data: Record<string, any> = {}
    const allowed = [
      'firstName',
      'middleName',
      'lastName',
      'fullName',
      'sortName',
      'recognitionName',
      'informalName',
      'formalName',
      'envelopeName',
      'prefix',
      'suffix',
      'birthdate',
      'jobTitle',
      'employer',
      'website',
      'facebookId',
      'twitterId',
      'linkedInId',
      'type',
      'status',
      'communicationChannelPreferred',
      'emailInterestIsActive',
      'createdName',
      'lastModifiedName',
    ]
    for (const key of allowed) {
      if (b[key] !== undefined) data[key] = b[key]
    }

    // Maintain last modified stamp
    data.lastModifiedDate = new Date()

    const updated = await prisma.constituent.update({
      where: { id },
      data,
    })
    res.json(updated)
  } catch (error: any) {
    console.error('Error updating constituent:', error)
    res.status(500).json({ error: error?.message || 'Failed to update constituent' })
  }
})

// DELETE /constituents/:id - delete by AccountNumber
router.delete('/constituents/:id', async (req, res) => {
  const { id } = req.params
  try {
  const existing = await prisma.constituent.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Constituent not found' })

  await prisma.constituent.delete({ where: { id } })
    res.status(204).send()
  } catch (error: any) {
    console.error('Error deleting constituent:', error)
    res.status(500).json({ error: 'Failed to delete constituent' })
  }
})

// DELETE /constituents - delete all (use with caution)
router.delete('/constituents', async (_req, res) => {
  try {
  await prisma.constituent.deleteMany({})
    res.status(204).send()
  } catch (error: any) {
    console.error('Error deleting constituents:', error)
    res.status(500).json({ error: 'Failed to delete constituents' })
  }
})

export default router
