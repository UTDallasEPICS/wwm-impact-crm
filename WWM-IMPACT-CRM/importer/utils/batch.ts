// importer/utils/batch.ts

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function batchCreate(model: { createMany: (arg0: { data: any[]; skipDuplicates: boolean; }) => any; }, data: any[], batchSize = 500) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    if (!batch.length) continue;

    await model.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
}

export async function batchTransaction(ops: any[], chunk = 50) {
  for (let i = 0; i < ops.length; i += chunk) {
    await prisma.$transaction(ops.slice(i, i + chunk));
  }
}
