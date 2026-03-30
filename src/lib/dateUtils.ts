/**
 * Robust date parser for receipt dates.
 * Handles formats like "Mar 26, 2026", "19-Jan-26", "2026-01-19", ISO strings, etc.
 * Two-digit years are interpreted as 2000+.
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function parseReceiptDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;

  const s = String(input).trim();

  // Format: "DD-Mon-YY" or "DD/Mon/YY" or "DD Mon YY" (e.g. "19-Jan-26")
  const dmy = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3,9})[-/ ](\d{2,4})$/);
  if (dmy) {
    const monthKey = dmy[2].slice(0, 3).toLowerCase();
    const month = MONTH_MAP[monthKey];
    if (month !== undefined) {
      let year = Number(dmy[3]);
      if (year < 100) year += 2000;
      const d = new Date(year, month, Number(dmy[1]));
      return Number.isNaN(d.getTime()) ? null : d;
    }
  }

  // Format: "Mon DD, YYYY" (e.g. "Mar 26, 2026")
  const mdy = s.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{2,4})$/);
  if (mdy) {
    const monthKey = mdy[1].slice(0, 3).toLowerCase();
    const month = MONTH_MAP[monthKey];
    if (month !== undefined) {
      let year = Number(mdy[3]);
      if (year < 100) year += 2000;
      const d = new Date(year, month, Number(mdy[2]));
      return Number.isNaN(d.getTime()) ? null : d;
    }
  }

  // ISO or standard date string — append T00:00:00 if no time component to avoid timezone shifts
  const d = new Date(s.includes("T") ? s : `${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Returns the receipt's effective date, preferring the `date` field, falling back to `created_at`. */
export function getReceiptDate(receipt: { date?: string; created_at?: string }): Date | null {
  return parseReceiptDate(receipt.date) ?? parseReceiptDate(receipt.created_at);
}
