/**
 * Time helpers for the restaurant's hours — pure functions, safe on server
 * and client. The shop runs on Palm Desert time regardless of the visitor.
 */

export const RESTAURANT_TZ = "America/Los_Angeles";

/** "11:30" → minutes since midnight. */
export function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

/** Current minutes since midnight in the restaurant's timezone. */
export function minutesNowInTz(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RESTAURANT_TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return (h % 24) * 60 + m;
}

/** "11:00" → "11:00 am", "19:30" → "7:30 pm". */
export function fmt(hm: string): string {
  return fmtMinutes(parseHM(hm));
}

/** Minutes since midnight → "2:41 pm". */
export function fmtMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  const period = h >= 12 ? "pm" : "am";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

/** Shift an "HH:MM" time by minutes (wraps around midnight). */
export function shiftHM(hm: string, deltaMin: number): string {
  const total = (parseHM(hm) + deltaMin + 1440) % 1440;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
