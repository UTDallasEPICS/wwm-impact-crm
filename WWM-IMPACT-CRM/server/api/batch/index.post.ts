import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import prisma from '../../../lib/prisma'

/**
 * Generic batch endpoint for server/api resources.
 *
 * POST /api/batch
 * Body:
 * {
 *   "transaction": boolean (optional, if true all mutating ops run atomically),
 *   "operations": [
 *     {
 *       "id": "optional correlation id",
 *       "method": "GET" | "POST" | "PATCH" | "DELETE",
 *       "path": "/donations/abc123" | "/constituents/acct:ACC123" | "/softCredits/xyz" | etc,
 *       "data": { ... } // for POST/PATCH
 *     }
 *   ]
 * }
 *
 * Path rules:
 *   - resource is first segment after '/'.
 *   - Optional id/accountNumber segment. For constituents you can pass 'acct:ACCOUNTNUMBER' to key by accountNumber instead of id.
 *
 * Response:
 * { results: [ { id, status, data?, error? } ] }
 */

interface BatchOp {
  id?: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  data?: any
}
interface BatchBody {
  transaction?: boolean
  operations: BatchOp[]
}

function parsePath(path: string): { resource: string; target?: string } {
  const clean = path.replace(/^\//, '')
  const [resource, target] = clean.split('/')
  return { resource, target }
}

async function execOne(op: BatchOp, client: any) {
  const out: any = { id: op.id, method: op.method, path: op.path }
  const { resource, target } = parsePath(op.path || '')

  try {
    switch (resource) {
      case 'donations': {
        if (op.method === 'POST') {
          out.data = await client.donation.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.donation.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.donation.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.donation.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported donations operation'
        }
        break
      }
      case 'constituents': {
        // allow acct:ACCOUNTNUMBER notation
        const byAcct = target && target.startsWith('acct:')
        const where = byAcct ? { accountNumber: String(target.slice(5)) } : target ? { id: target } : undefined
        if (op.method === 'POST') {
          out.data = await client.constituent.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && where) {
          const row = await client.constituent.findUnique({ where })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && where) {
          out.data = await client.constituent.update({ where, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && where) {
          await client.constituent.delete({ where })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported constituents operation'
        }
        break
      }
      case 'softCredits': {
        if (op.method === 'POST') {
          out.data = await client.softCredit.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.softCredit.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.softCredit.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.softCredit.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported softCredits operation'
        }
        break
      }
      case 'emailInterest': {
        if (op.method === 'POST') {
          out.data = await client.emailInterest.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.emailInterest.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.emailInterest.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.emailInterest.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported emailInterest operation'
        }
        break
      }
      case 'fund': {
        if (op.method === 'POST') {
          out.data = await client.fund.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.fund.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.fund.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.fund.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported fund operation'
        }
        break
      }
      case 'designation': {
        if (op.method === 'POST') {
          out.data = await client.designation.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.designation.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.designation.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.designation.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported designation operation'
        }
        break
      }
      case 'campaign': {
        if (op.method === 'POST') {
          out.data = await client.campaign.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.campaign.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.campaign.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.campaign.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported campaign operation'
        }
        break
      }
      case 'appeals': {
        if (op.method === 'POST') {
          out.data = await client.appeal.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.appeal.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.appeal.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.appeal.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported appeals operation'
        }
        break
      }
      case 'donors': {
        if (op.method === 'POST') {
          out.data = await client.donor.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.donor.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.donor.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.donor.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported donors operation'
        }
        break
      }
      default: {
        out.status = 400
        out.error = 'Unknown resource'
      }
    }
  } catch (err: any) {
    out.status = out.status || 500
    out.error = err?.message || 'Operation failed'
  }
  return out
}

export default defineEventHandler(async (event) => {
  try {
    const body: BatchBody = (await readBody(event)) || ({} as any)
    const ops = Array.isArray(body.operations) ? body.operations : []
    const useTx = !!body.transaction

    if (!ops.length) {
      setResponseStatus(event, 400)
      return { error: 'operations array required' }
    }

    let results: any[] = []
    if (useTx) {
      const mut = ops.filter(o => o.method !== 'GET')
      const reads = ops.filter(o => o.method === 'GET')
      if (mut.length) {
        const txRes = await prisma.$transaction(async (tx) => {
          const acc: any[] = []
          for (const m of mut) acc.push(await execOne(m, tx))
          return acc
        })
        results.push(...txRes)
      }
      for (const r of reads) results.push(await execOne(r, prisma))
    } else {
      for (const op of ops) results.push(await execOne(op, prisma))
    }

    setResponseStatus(event, 200)
    return { results }
  } catch (e: any) {
    console.error('Batch endpoint error:', e)
    setResponseStatus(event, 500)
    return { error: e?.message || 'Internal Server Error' }
  }
})
