// server/api/ingest/upload.post.ts

import { runImporter } from "../../../importer/importer";

export async function POST(req: Request) {
  const form = await req.formData();
  const files = [];

  for (const entry of form.entries()) {
    const [key, value] = entry;
    if (value instanceof File) {
      const buffer = Buffer.from(await value.arrayBuffer());
      files.push({ name: value.name, buffer });
    }
  }

  await runImporter(files);

  return new Response("Import complete");
}
