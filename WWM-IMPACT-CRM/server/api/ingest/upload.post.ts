import { defineEventHandler, readBody } from 'h3';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import readXlsxFile from 'read-excel-file/node';
import { parse as csvParseSync } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Utility to get "basename" of uploaded file:
 * - removes trailing .xlsx or .csv
 * - also handles names like "WalletItems.csv.csv" or "WalletItems.csv.xlsx"
 */
function getBaseName(filename: string) {
  let n = filename;
  // remove final extension(s)
  while (true) {
    if (n.toLowerCase().endsWith('.xlsx')) n = n.slice(0, -5);
    else if (n.toLowerCase().endsWith('.csv')) n = n.slice(0, -4);
    else break;
  }
  // Trim potential whitespace
  return path.basename(n).trim();
}

async function parseXlsx(filePath: string) {
  // readXlsxFile returns rows: array of arrays
  const rows = await readXlsxFile(fs.createReadStream(filePath));
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].map((h: any) => String(h || '').trim());
  const result: Record<string, string>[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j] || `col_${j}`;
      obj[key] = row[j] == null ? '' : String(row[j]);
    }
    // ignore empty rows
    const allEmpty = Object.values(obj).every(v => v === '');
    if (!allEmpty) result.push(obj);
  }
  return result;
}

async function parseCsv(filePath: string) {
  const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
  // csv-parse/sync with columns: true returns array of objects keyed by header names
  const records = csvParseSync(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];
  return records;
}

/**
 * Per-file handlers:
 * Each handler receives (rows, prisma)
 * and should upsert/create objects accordingly.
 *
 * WARNING: These handlers are pragmatic and map common columns.
 * You may add/adjust fields as needed for your data.
 */

async function handleConstituents(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const accountNumber = (r['AccountNumber'] ?? '').toString().trim();
    if (!accountNumber) {
      console.warn('Constituent row missing AccountNumber, skipping:', r);
      continue;
    }
    const createData: any = {
      accountNumber,
      firstName: r['First'] || r['FirstName'] || undefined,
      middleName: r['Middle'] || undefined,
      lastName: r['Last'] || r['LastName'] || undefined,
      fullName: r['FullName'] || r['Full'] || undefined,
      informalName: r['InformalName'] || undefined,
      formalName: r['FormalName'] || undefined,
      gender: (r['Gender'] || '').toUpperCase() || undefined,
      website: r['Website'] || undefined,
    };

    // parse birthdate if present
    if (r['Birthdate']) {
      const d = new Date(r['Birthdate']);
      if (!isNaN(d.getTime())) createData.birthdate = d;
    }
    try {
      await prisma.constituent.upsert({
        where: { accountNumber },
        create: createData,
        update: createData,
      });
      processed++;
    } catch (err) {
      console.error('Error upserting constituent', accountNumber, err);
    }
  }
  return processed;
}

async function handleEmails(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const accountNumber = (r['AccountNumber'] ?? '').toString().trim();
    const value = r['Value'] || r['Email'] || r['Value'] || '';
    if (!accountNumber || !value) {
      console.warn('Email row missing AccountNumber or Value, skipping:', r);
      continue;
    }
    const constituent = await prisma.constituent.findUnique({
      where: { accountNumber },
    });
    if (!constituent) {
      console.warn('Email row references missing constituent:', accountNumber);
      continue;
    }
    try {
      // insert email (no unique constraint in model for value)
      await prisma.email.create({
        data: {
          constituentId: constituent.id,
          value,
          type: undefined,
          isPrimary: (String(r['IsPrimary'] || '') || '').toLowerCase() === 'true',
          isBad: (String(r['IsBad'] || '') || '').toLowerCase() === 'true',
        },
      });
      processed++;
    } catch (err) {
      console.error('Error creating email for', accountNumber, err);
    }
  }
  return processed;
}

async function handlePhones(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const accountNumber = (r['AccountNumber'] ?? '').toString().trim();
    const number = r['Number'] || r['Phone'] || '';
    if (!accountNumber || !number) {
      console.warn('Phone row missing AccountNumber or Number, skipping:', r);
      continue;
    }
    const constituent = await prisma.constituent.findUnique({
      where: { accountNumber },
    });
    if (!constituent) {
      console.warn('Phone row references missing constituent:', accountNumber);
      continue;
    }
    try {
      await prisma.phone.create({
        data: {
          constituentId: constituent.id,
          number,
          type: undefined,
          isPrimary: (String(r['IsPrimary'] || '') || '').toLowerCase() === 'true',
        },
      });
      processed++;
    } catch (err) {
      console.error('Error creating phone for', accountNumber, err);
    }
  }
  return processed;
}

async function handleAddresses(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const accountNumber = (r['AccountNumber'] ?? '').toString().trim();
    if (!accountNumber) {
      console.warn('Address row missing AccountNumber, skipping:', r);
      continue;
    }
    const constituent = await prisma.constituent.findUnique({
      where: { accountNumber },
    });
    if (!constituent) {
      console.warn('Address row references missing constituent:', accountNumber);
      continue;
    }
    try {
      const data: any = {
        constituentId: constituent.id,
        street: r['Street'] || undefined,
        city: r['City'] || undefined,
        state: r['State'] || undefined,
        postalCode: r['PostalCode'] || r['Zip'] || undefined,
        country: r['Country'] || undefined,
        isPrimary: (String(r['IsPrimary'] || '') || '').toLowerCase() === 'true',
        isBad: (String(r['IsBad'] || '') || '').toLowerCase() === 'true',
      };
      await prisma.address.create({ data });
      processed++;
    } catch (err) {
      console.error('Error creating address', err);
    }
  }
  return processed;
}

async function handleFunds(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const name = r['Name'] || r['FundName'] || undefined;
    if (!name) continue;
    try {
      await prisma.fund.upsert({
        where: { id: `${name}` }, // cheap upsert key (not ideal) - you can change to a better unique field
        create: {
          id: `${name}`,
          name,
          isActive: String(r['IsActive'] || '').toLowerCase() === 'true',
          isDefault: String(r['IsDefault'] || '').toLowerCase() === 'true',
          organizationId: (await getDefaultOrganizationId()) || '', // helper below
        },
        update: {
          name,
          isActive: String(r['IsActive'] || '').toLowerCase() === 'true',
          isDefault: String(r['IsDefault'] || '').toLowerCase() === 'true',
        },
      });
      processed++;
    } catch (err) {
      console.error('Error upserting fund', name, err);
    }
  }
  return processed;
}

async function handleCampaigns(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const name = r['Name'] || undefined;
    if (!name) continue;
    try {
      await prisma.campaign.upsert({
        where: { id: `${name}` },
        create: {
          id: `${name}`,
          name,
          goal: r['Goal'] || undefined,
          startDate: r['StartDate'] ? new Date(r['StartDate']) : undefined,
          endDate: r['EndDate'] ? new Date(r['EndDate']) : undefined,
          isActive: String(r['IsActive'] || '').toLowerCase() === 'true',
        },
        update: {
          goal: r['Goal'] || undefined,
          isActive: String(r['IsActive'] || '').toLowerCase() === 'true',
        },
      });
      processed++;
    } catch (err) {
      console.error('Error upserting campaign', name, err);
    }
  }
  return processed;
}

async function handleAppeals(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const name = r['Name'] || undefined;
    if (!name) continue;
    try {
      await prisma.appeal.upsert({
        where: { id: `${name}` },
        create: {
          id: `${name}`,
          name,
          campaignId: (await getCampaignIdByName(r['CampaignName'] || '')) || undefined,
        } as any,
        update: {
          name,
        } as any,
      });
      processed++;
    } catch (err) {
      console.error('Error upserting appeal', name, err);
    }
  }
  return processed;
}

async function handleDonations(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const tx = r['TransactionNumber'] || r['Transaction'] || r['TransactionNumber'] || '';
    const transactionNumber = tx ? parseInt(String(tx)) : undefined;
    const accountNumber = (r['AccountNumber'] ?? '').toString().trim();
    const amount = r['Amount'] ? parseFloat(String(r['Amount'])) : undefined;

    // Find constituent for linking
    let constituentId: string | undefined;
    if (accountNumber) {
      const c = await prisma.constituent.findUnique({ where: { accountNumber } });
      if (c) constituentId = c.id;
    }

    const donationData: any = {
      amount: amount ?? 0,
      method: undefined,
      note: r['Note'] || undefined,
      date: r['Date'] ? new Date(r['Date']) : undefined,
      transactionNumber,
      donorId: undefined,
      constituentId: constituentId ?? undefined,
      createdName: r['CreatedName'] || undefined,
      createdDate: r['CreatedDate'] ? new Date(r['CreatedDate']) : undefined,
    };

    try {
      if (transactionNumber) {
        await prisma.donation.upsert({
          where: { transactionNumber },
          create: donationData,
          update: donationData,
        });
      } else {
        await prisma.donation.create({ data: donationData });
      }
      processed++;
    } catch (err) {
      console.error('Error creating/updating donation', err, r);
    }
  }
  return processed;
}

/**
 * Transactions.csv often duplicates donation info; we'll attempt to create Donation if transactionNumber present.
 */
async function handleTransactions(rows: Record<string, string>[]) {
  // Just forward to donations handler for rows that have TransactionNumber or Amount
  const donationRows = rows.filter(r => r['TransactionNumber'] || r['TransactionNumber'] || r['Amount']);
  return handleDonations(donationRows);
}

async function handleHouseholds(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    const accNum = (r['AccountNumber'] ?? '').toString().trim();
    const name = r['FullName'] || r['EnvelopeName'] || undefined;
    if (!accNum || !name) continue;
    try {
      await prisma.household.upsert({
        where: { accountNumber: accNum },
        create: { accountNumber: accNum, fullName: name, name },
        update: { fullName: name, name },
      });
      processed++;
    } catch (err) {
      console.error('Error upserting household', err);
    }
  }
  return processed;
}

async function handleFileAttachments(rows: Record<string, string>[]) {
  let processed = 0;
  for (const r of rows) {
    // minimal mapping
    const url = r['Url'] || r['URL'] || r['Url'];
    const name = r['Name'] || undefined;
    if (!url) continue;
    try {
      await prisma.fileAttachment.create({
        data: {
          url,
          name,
          createdDateUtc: r['CreatedDateUtc'] ? new Date(r['CreatedDateUtc']) : undefined,
        } as any,
      });
      processed++;
    } catch (err) {
      console.error('Error creating file attachment', err);
    }
  }
  return processed;
}

/* -----------------------
   Helpers
   ----------------------- */

async function getDefaultOrganizationId() {
  // create or return a default organization to attach Funds to.
  const name = 'DefaultOrg';
  let org = await prisma.organization.findFirst({ where: { name } });
  if (!org) {
    org = await prisma.organization.create({ data: { name } });
  }
  return org.id;
}

async function getCampaignIdByName(name: string) {
  if (!name) return undefined;
  const c = await prisma.campaign.findFirst({ where: { name } });
  return c?.id;
}

/* ------------ file handler dispatch map -------------- */

const handlerMap: Record<string, (rows: Record<string, string>[]) => Promise<number>> = {
  'Constituents': handleConstituents,
  'Emails': handleEmails,
  'Phones': handlePhones,
  'Addresses': handleAddresses,
  'Funds': handleFunds,
  'Campaigns': handleCampaigns,
  'Appeals': handleAppeals,
  'Donations': handleDonations,
  'Transactions': handleTransactions,
  'Households': handleHouseholds,
  'FileAttachments': handleFileAttachments,
  // Add more mappings here as you want to support more files
};

/* -------------- Main route handler --------------- */

export default defineEventHandler(async (event) => {
  // parse incoming multipart with formidable into temporary files
  const form = formidable({ multiples: true, keepExtensions: true });
  const parsed: any = await new Promise((resolve, reject) => {
    form.parse((event.node.req as any), (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const files = Array.isArray(parsed.files?.files) ? parsed.files.files : (parsed.files?.files ? [parsed.files.files] : []);
  // also handle case single-file form key 'files' vs many
  // formidable shape varies; accept both

  const summary: { filename: string; rows: number; processed: number; note?: string }[] = [];
  let totalProcessed = 0;

  for (const f of files) {
    const filepath = f.filepath || f.path || f.file;
    const originalFilename = f.originalFilename || f.name || f.filename || f.newFilename || '';
    const ext = path.extname(originalFilename || filepath).toLowerCase();
    const baseName = getBaseName(originalFilename || filepath);

    try {
      let rows: Record<string, string>[] = [];
      if (ext === '.xlsx') {
        rows = await parseXlsx(filepath);
      } else {
        // treat anything else as CSV
        rows = await parseCsv(filepath);
      }
      const handler = handlerMap[baseName];
      if (handler) {
        const processed = await handler(rows);
        summary.push({ filename: originalFilename || filepath, rows: rows.length, processed });
        totalProcessed += processed;
      } else {
        // Not implemented handler: log rows and return how many rows parsed so client knows
        console.info(`No handler for ${baseName}. Parsed ${rows.length} rows; sample:`, rows.slice(0, 3));
        summary.push({ filename: originalFilename || filepath, rows: rows.length, processed: 0, note: 'no handler' });
      }
    } catch (err) {
      console.error('Error processing file', originalFilename, err);
      summary.push({ filename: originalFilename || filepath, rows: 0, processed: 0, note: 'error' });
    } finally {
      // remove uploaded temp file if exists
      try { if (fs.existsSync(f.filepath)) fs.unlinkSync(f.filepath); } catch {}
    }
  }

  return { success: true, summary, processed: totalProcessed };
});
