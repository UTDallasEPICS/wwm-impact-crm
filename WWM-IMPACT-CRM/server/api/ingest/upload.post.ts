import { readMultipartFormData } from "h3";
import { runImporter } from "../../../importer/importer";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  const files = [];

  if (form) {
    for (const item of form) {
      if (item.type === "application/vnd.ms-excel" && item.filename) {
        files.push({
          name: item.filename,
          type: "csv",
          buffer: item.data,
        });
      }
      if (item.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && item.filename) {
        files.push({
          name: item.filename,
          type: "xlsx",
          buffer: item.data,
        });
      }
    }
  }

  await runImporter(files);

  return { status: "ok" };
});
