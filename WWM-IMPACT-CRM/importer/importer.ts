// importer/importer.ts

import { parseCSV } from "./utils/parse";
import { getHandler } from "./handlerMap";

export async function runImporter(files: { name: string, buffer: Buffer }[]) {
  for (const file of files) {
    const handler = getHandler(file.name);

    if (!handler) {
      console.warn(`No handler found for ${file.name}, skipping`);
      continue;
    }

    console.log(`Importing ${file.name}...`);

    const rows = await parseCSV(file.buffer);
    await handler(rows);

    console.log(`Finished ${file.name}`);
  }

  console.log("ALL FILES IMPORTED SUCCESSFULLY");
}
