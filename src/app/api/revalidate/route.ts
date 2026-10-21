import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";

/**
 * Deploy hook. CI builds run against an empty CMS database, so freshly
 * deployed prerendered HTML is seed content; the deploy workflow POSTs here
 * (Bearer REVALIDATE_TOKEN) right after the PM2 reload so the live SQLite
 * content is re-rendered immediately instead of after the next hourly ISR
 * pass. Unset token = endpoint disabled (same convention as ADMIN_PASSWORD).
 */

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  const token = process.env.REVALIDATE_TOKEN;
  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !safeEqual(given, token)) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Same pair as the admin saves' revalidateSite(): the layout call does not
  // cover route handlers, so /llms.txt needs its own.
  revalidatePath("/", "layout");
  revalidatePath("/llms.txt");
  return Response.json({ revalidated: true });
}
