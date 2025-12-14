import Papa from "papaparse";
import readXlsxFile from "read-excel-file/node";

export async function parse(type: string, fileBuffer: Buffer) {
  if (type === "csv") {
    return await parseCSV(fileBuffer);
  }
  else if (type === "xlsx") {
    return await parseXLSX(fileBuffer);
  }
  else {
    console.log("Can only parse CSV or XLSX");
    return [];
  }
}

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

export async function parseXLSX(fileBuffer: Buffer): Promise<any[]> {
  const rawRows = await readXlsxFile(fileBuffer);

  if (!rawRows.length) return [];

  const headers = (rawRows[0] ?? [])
    .map((h) => (h === null || h === undefined ? "" : String(h).trim()));

  if (!headers.length) return [];

  const rows: Record<string, any>[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const rawRow = rawRows[i];
    const obj: Record<string, any> = {};

    for (let col = 0; col < headers.length; col++) {
      const header = headers[col];
      if (!header || rawRow === undefined) continue;

      const value = rawRow[col];
      
      if (value === undefined || value === null) {
        obj[header] = null;
      } else if (value instanceof Date) {
        obj[header] = value;
      } else {
        obj[header] = String(value);
      }
    }

    rows.push(obj);
  }

  return rows;
}
