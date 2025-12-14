import prisma from '../../lib/prisma';

export async function handleUsers(rows: any[]) {
  const mapped = rows.map(r => ({
    email: r.Email,
    username: r.Username ?? null,
    name: r.Name ?? null,
    phone: r.Phone ?? null,
    country: r.Country ?? null,
    language: r.Language ?? null,
    timeZone: r.TimeZone ?? null,
    sortName: r.SortName ?? null,
    isActive: r.IsActive ?? null,
  }));

  const tx = await prisma.$transaction(
    mapped.map(record =>
      prisma.bloomerangUser.upsert({
        where: { email: record.email },
        update: record,
        create: record,
      })
    )
  );

  return tx.length;
}
