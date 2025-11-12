import { defineEventHandler, readBody } from "h3";
import prisma from "../../../lib/prisma";
import { AppliesTo, DataType } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, appliesTo, dataType } = body || {};

    if (!name || !appliesTo || !dataType) {
      event.node.res.statusCode = 400;
      return { error: "name, appliesTo, and dataType are required" };
    }
    const appliesOk = Object.values(AppliesTo).includes(appliesTo as AppliesTo);
    const typeOk = Object.values(DataType).includes(dataType as DataType);

    if (!appliesOk || !typeOk) {
      event.node.res.statusCode = 400;
      return {
        error: "Invalid enum value",
        details: {
          expected: {
            appliesTo: Object.values(AppliesTo),
            dataType: Object.values(DataType),
          },
          received: { appliesTo, dataType },
        },
      };
    }
    const picklist =
      (dataType as DataType) === "PICKLIST" ? body?.picklist ?? null : null;
    const field = await prisma.customField.create({
      data: {
        name,
        appliesTo: appliesTo as AppliesTo,
        dataType: dataType as DataType,
        isRequired: body?.isRequired ?? false,
        isActive: body?.isActive ?? true,
        picklist,
        helpText: body?.helpText ?? null,
      },
    });

    return { data: field };
  } catch (err: any) {
    return { error: "Failed to create custom field", details: err };
  }
});
