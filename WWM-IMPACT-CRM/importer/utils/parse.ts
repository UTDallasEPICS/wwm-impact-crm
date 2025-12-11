// importer/utils/parse.ts

import Papa from "papaparse";

export async function parseCSV(fileBuffer: Buffer) {
  return new Promise<any[]>((resolve, reject) => {
    Papa.parse(fileBuffer.toString(), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
}
