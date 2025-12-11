// importer/utils/parse.ts

import Papa from "papaparse";
import readXlsxFile from "read-excel-file/node";

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

/**
 * Parse XLSX file into array of row objects.
 * First row is treated as column headers.
 */
/*export async function parseXLSX(fileBuffer: Buffer): Promise<any[]> {
  // read-excel-file expects `{ buffer }`
  const typedArray = new Uint8Array(fileBuffer);
  const rawBuffer: ArrayBuffer = typedArray.buffer; 
  const rows = await readXlsxFile(input: Input);

  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => String(h || "").trim());

  const results = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj: Record<string, any> = {};

    for (let col = 0; col < headers.length; col++) {
      const header = headers[col];
      obj[header] = row[col] ?? null;
    }

    results.push(obj);
  }

  return results;
}*/
