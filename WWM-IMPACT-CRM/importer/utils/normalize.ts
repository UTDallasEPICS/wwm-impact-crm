export function normalizeName(name: string): string {
  if (!name) return "";

  return name
    .replace(/\.csv\.xlsx$/i, "")
    .replace(/\.xlsx$/i, "")
    .replace(/\.csv$/i, "")
    .trim()
    .toLowerCase();
}
