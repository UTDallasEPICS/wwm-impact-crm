import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { PrismaClient } from '@prisma/client'

const fallbackPrisma = new PrismaClient()

type BatchOp = {
  id?: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  // path like '/walletItems/123' or '/constituents/acct:ABC123'
  path: string
  data?: any
}

type BatchBody = {
  operations: BatchOp[]
  transaction?: boolean
}

function parsePath(path: string): { resource: string; target?: string } {
  const clean = path.replace(/^\//, '')
  const [resource, target] = clean.split('/')
  return { resource, target }
}

// Execute one operation using the provided Prisma client (could be tx inside a transaction)
async function runOne(op: BatchOp, prisma: any) {
  const result: any = { id: op.id, method: op.method, path: op.path }
  const { resource, target } = parsePath(op.path || '')

  try {
    switch (resource) {
      case 'walletItems': {
        if (op.method === 'POST') {
          result.data = await prisma.walletItem.create({ data: op.data })
          result.status = 201
        } else if (op.method === 'GET' && target) {
          const found = await prisma.walletItem.findUnique({ where: { id: target } })
          result.status = found ? 200 : 404
          result.data = found || null
        } else if (op.method === 'PATCH' && target) {
          result.data = await prisma.walletItem.update({ where: { id: target }, data: op.data })
          result.status = 200
        } else if (op.method === 'DELETE' && target) {
          await prisma.walletItem.delete({ where: { id: target } })
          result.status = 200
          result.data = { ok: true }
        } else {
          result.status = 400
          result.error = 'Unsupported walletItems operation'
        }
        break
      }

      case 'softCredits': {
        if (op.method === 'POST') {
          result.data = await prisma.softCredit.create({ data: op.data })
          result.status = 201
        } else if (op.method === 'GET' && target) {
          const found = await prisma.softCredit.findUnique({ where: { id: target } })
          result.status = found ? 200 : 404
          result.data = found || null
        } else if (op.method === 'PATCH' && target) {
          result.data = await prisma.softCredit.update({ where: { id: target }, data: op.data })
          result.status = 200
        } else if (op.method === 'DELETE' && target) {
          await prisma.softCredit.delete({ where: { id: target } })
          result.status = 200
          result.data = { ok: true }
        } else {
          result.status = 400
          result.error = 'Unsupported softCredits operation'
        }
        break
      }

      case 'transactionProcessorAccounts': {
        if (op.method === 'POST') {
          result.data = await prisma.transactionProcessorAccount.create({ data: op.data })
          result.status = 201
        } else if (op.method === 'GET' && target) {
          const found = await prisma.transactionProcessorAccount.findUnique({ where: { id: target } })
          result.status = found ? 200 : 404
          result.data = found || null
        } else if (op.method === 'PATCH' && target) {
          result.data = await prisma.transactionProcessorAccount.update({ where: { id: target }, data: op.data })
          result.status = 200
        } else if (op.method === 'DELETE' && target) {
          await prisma.transactionProcessorAccount.delete({ where: { id: target } })
          result.status = 200
          result.data = { ok: true }
        } else {
          result.status = 400
          result.error = 'Unsupported transactionProcessorAccounts operation'
        }
        break
      }

      case 'emailInterest': {
        if (op.method === 'POST') {
          result.data = await prisma.emailInterest.create({ data: op.data })
          result.status = 201
        } else if (op.method === 'GET' && target) {
          const found = await prisma.emailInterest.findUnique({ where: { id: target } })
          result.status = found ? 200 : 404
          result.data = found || null
        } else if (op.method === 'PATCH' && target) {
          result.data = await prisma.emailInterest.update({ where: { id: target }, data: op.data })
          result.status = 200
        } else if (op.method === 'DELETE' && target) {
          await prisma.emailInterest.delete({ where: { id: target } })
          result.status = 200
          result.data = { ok: true }
        } else {
          result.status = 400
          result.error = 'Unsupported emailInterest operation'
        }
        break
      }

      case 'constituents': {
        // Support id or accountNumber via acct: prefix, e.g., '/constituents/acct:ACC123'
        const byAccountNumber = target && target.startsWith('acct:')
        const key = byAccountNumber ? { accountNumber: String(target?.slice(5)) } : (target ? { id: target } : undefined)

        if (op.method === 'POST') {
          result.data = await prisma.constituent.create({ data: op.data })
          result.status = 201
        } else if (op.method === 'GET' && key) {
          const found = await prisma.constituent.findUnique({ where: key })
          result.status = found ? 200 : 404
          result.data = found || null
        } else if (op.method === 'PATCH' && key) {
          result.data = await prisma.constituent.update({ where: key, data: op.data })
          result.status = 200
        } else if (op.method === 'DELETE' && key) {
          await prisma.constituent.delete({ where: key })
          result.status = 200
          result.data = { ok: true }
        } else {
          result.status = 400
          result.error = 'Unsupported constituents operation'
        }
        break
      }

      default: {
        result.status = 400
        result.error = 'Unknown resource'
      }
    }
  } catch (err: any) {
    result.status = result.status || 500
    result.error = err?.message || 'Operation failed'
  }

  return result
}

export default defineEventHandler(async (event) => {
  const prismaAny: any = (event as any).context?.prisma ?? fallbackPrisma

  try {
    const body: BatchBody = (await readBody(event)) || ({} as any)
    const ops = Array.isArray(body?.operations) ? body.operations : []
    const useTx = !!body?.transaction

    if (!ops.length) {
      setResponseStatus(event, 400)
      return { error: 'operations array required' }
    }

    let results: any[] = []

    if (useTx) {
      // Execute mutating operations in a single transaction; GETs run outside
      const mutating = ops.filter((o) => o.method !== 'GET')
      const reads = ops.filter((o) => o.method === 'GET')

      if (mutating.length) {
        const txResults = await prismaAny.$transaction(async (tx: any) => {
          const acc: any[] = []
          for (const op of mutating) {
            acc.push(await runOne(op, tx))
          }
          return acc
        })
        results.push(...txResults)
      }

      for (const r of reads) {
        results.push(await runOne(r, prismaAny))
      }
    } else {
      for (const op of ops) {
        results.push(await runOne(op, prismaAny))
      }
    }

    setResponseStatus(event, 200)
    return { results }
  } catch (e: any) {
    console.error('Batch endpoint error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
