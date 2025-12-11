// importer/importer.ts

import { parseCSV } from "./utils/parse";
import { getHandler } from "./handlerMap";

export async function runImporter(files: { name: string, type: string, buffer: Buffer }[]) {
  for (const file of files) {
    const handler = getHandler(file.name);

    if (!handler) {
      console.warn(`No handler found for ${file.name}, skipping`);
      continue;
    }

    console.log(`Importing ${file.name}...`);

    let rows = [];
    
    if (file.type === "csv") {
      console.log(file.buffer);
      rows = await parseCSV(file.buffer);
    }
    else if (file.type == "xlsx") {
      // await parseXLSX(file.buffer);
    }
    else {
      console.log("Can only parse CSV or XLSX");
    }

    await handler(rows);

    console.log(`Finished ${file.name}`);
  }
}
