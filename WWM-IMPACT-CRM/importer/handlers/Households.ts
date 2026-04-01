import prisma from '../../lib/prisma';

export async function handleHouseholds(rows: any[]) {
  const mapped = rows.map(r => ({
    accountNumber: r.AccountNumber,
    envelopeName: r.EnvelopeName ?? null,
    formalName: r.FormalName ?? null,
    fullName: r.FullName ?? null,
    informalName: r.InformalName ?? null,
    recognitionName: r.RecognitionName ?? null,
    sortName: r.SortName ?? null,
    status: r.Status ?? null,
    headId: r.Head ?? null,
  }));

  const tx = await prisma.$transaction(
    mapped.map(record =>
      prisma.household.upsert({
        where: { accountNumber: record.accountNumber },
        update: record,
        create: record,
      })
    )
  );

  return tx.length;
}
