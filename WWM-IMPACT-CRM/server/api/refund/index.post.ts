import { defineEventHandler, readBody } from "h3";
import prisma from "../../../lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, donationId, constituentId } = body || {};
    if (
      amount === undefined ||
      amount === null ||
      !donationId ||
      !constituentId
    ) {
      event.node.res.statusCode = 400;
      return { error: "amount, donationId, and constituentId are required" };
    }

    const created = await prisma.refund.create({
      data: {
        amount: Number(amount),
        date: body?.date ? new Date(body.date) : null,
        createdDate: body?.createdDate ? new Date(body.createdDate) : undefined, // has default
        createdName: body?.createdName ?? null,
        lastModifiedDate: body?.lastModifiedDate
          ? new Date(body.lastModifiedDate)
          : null,
        lastModifiedName: body?.lastModifiedName ?? null,
        note: body?.note ?? null,
        donationId,
        constituentId,
      },
    });

    return { data: created };
  } catch (err) {
    return { error: "Failed to create refund", details: err };
  }
});
