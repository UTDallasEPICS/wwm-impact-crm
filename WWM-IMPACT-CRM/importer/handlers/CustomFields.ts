import prisma from '../../lib/prisma';

export async function handleCustomFields(rows: any[]) {
  const mapped = rows.map(r => ({
    name: r.Name,
    appliesTo: r.AppliesTo,
    dataType: r.DataType ?? null,
    isRequired: r.IsRequired ?? null,
    isActive: r.IsActive ?? null,
  }));

  const tx = await prisma.$transaction(
    mapped.map(record =>
      prisma.customField.upsert({
        where: {
          name_appliesTo: {
            name: record.name,
            appliesTo: record.appliesTo,
          },
        },
        update: record,
        create: record,
      })
    )
  );

  return tx.length;
}
