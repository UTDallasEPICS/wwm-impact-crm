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

function parsePath(path: string): { resource: string; target: string | undefined } {
  const clean = path.replace(/^\//, '')
  const parts = clean.split('/')
  return { resource: parts[0] || '', target: parts[1] }
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
      case 'emails': {
        if (op.method === 'POST') {
          out.data = await client.email.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.email.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.email.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.email.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported emails operation'
        }
        break
      }
      case 'phones': {
        if (op.method === 'POST') {
          out.data = await client.phone.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.phone.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.phone.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.phone.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported phones operation'
        }
        break
      }
      case 'household': {
        if (op.method === 'POST') {
          out.data = await client.household.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.household.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.household.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.household.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported household operation'
        }
        break
      }
      case 'householdMembers': {
        if (op.method === 'POST') {
          out.data = await client.householdMember.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.householdMember.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.householdMember.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.householdMember.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported householdMembers operation'
        }
        break
      }
      case 'interactions': {
        if (op.method === 'POST') {
          out.data = await client.interaction.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.interaction.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.interaction.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.interaction.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported interactions operation'
        }
        break
      }
      case 'organizations': {
        if (op.method === 'POST') {
          out.data = await client.organization.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.organization.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.organization.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.organization.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported organizations operation'
        }
        break
      }
      case 'pledge': {
        if (op.method === 'POST') {
          out.data = await client.pledge.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.pledge.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.pledge.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.pledge.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported pledge operation'
        }
        break
      }
      case 'pledgePayments': {
        if (op.method === 'POST') {
          out.data = await client.pledgePayment.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.pledgePayment.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.pledgePayment.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.pledgePayment.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported pledgePayments operation'
        }
        break
      }
      case 'processingInfo': {
        if (op.method === 'POST') {
          out.data = await client.processingInfo.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.processingInfo.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.processingInfo.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.processingInfo.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported processingInfo operation'
        }
        break
      }
      case 'recurringDonation': {
        if (op.method === 'POST') {
          out.data = await client.recurringDonation.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.recurringDonation.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.recurringDonation.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.recurringDonation.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported recurringDonation operation'
        }
        break
      }
      case 'recurringDonationPayment': {
        if (op.method === 'POST') {
          out.data = await client.recurringDonationPayment.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.recurringDonationPayment.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.recurringDonationPayment.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.recurringDonationPayment.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported recurringDonationPayment operation'
        }
        break
      }
      case 'refund': {
        if (op.method === 'POST') {
          out.data = await client.refund.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.refund.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.refund.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.refund.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported refund operation'
        }
        break
      }
      case 'tasks': {
        if (op.method === 'POST') {
          out.data = await client.task.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.task.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.task.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.task.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported tasks operation'
        }
        break
      }
      case 'customFields': {
        if (op.method === 'POST') {
          out.data = await client.customField.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.customField.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.customField.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.customField.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported customFields operation'
        }
        break
      }
      case 'customValues': {
        if (op.method === 'POST') {
          out.data = await client.customValue.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.customValue.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.customValue.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.customValue.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported customValues operation'
        }
        break
      }
      case 'userOrganizations': {
        if (op.method === 'POST') {
          out.data = await client.bloomerangUserOrganization.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.bloomerangUserOrganization.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.bloomerangUserOrganization.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.bloomerangUserOrganization.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported userOrganizations operation'
        }
        break
      }
      case 'users': {
        if (op.method === 'POST') {
          out.data = await client.bloomerangUser.create({ data: op.data })
          out.status = 201
        } else if (op.method === 'GET' && target) {
          const row = await client.bloomerangUser.findUnique({ where: { id: target } })
          out.status = row ? 200 : 404
          out.data = row || null
        } else if (op.method === 'PATCH' && target) {
          out.data = await client.bloomerangUser.update({ where: { id: target }, data: op.data })
          out.status = 200
        } else if (op.method === 'DELETE' && target) {
          await client.bloomerangUser.delete({ where: { id: target } })
          out.status = 200
          out.data = { ok: true }
        } else {
          out.status = 400
          out.error = 'Unsupported users operation'
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
