import { parse } from "./utils/parse";
import { getHandler } from "./handlerMap";

export async function runImporter(files: { name: string, type: string, buffer: Buffer }[]) {
  let recordsProcessed = 0;
  
  for (const file of files) {
    const handler = getHandler(file.name);

    if (!handler) {
      console.warn(`No handler found for ${file.name}, skipping`);
      continue;
    }

    console.log(`Importing ${file.name}...`);

    const rows = await parse(file.type, file.buffer);
    recordsProcessed += await handler(rows);

    console.log(`Finished ${file.name}`);
  }

  return recordsProcessed;
}
