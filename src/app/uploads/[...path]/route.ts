import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPLOADS_DIR } from "@/lib/cms/images";

/**
 * Serves owner-uploaded menu photos from `data/uploads/` when R2 isn't
 * configured. A route handler (not public/) because `next start` snapshots
 * the public dir at boot — files written at runtime would 404 until restart.
 * Keys are content-hashed, so far-future immutable caching is safe.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params;
  // server-generated keys are [a-z0-9-/.]; reject anything else outright
  if (
    !segments?.length ||
    segments.some((s) => !/^[a-z0-9][a-z0-9._-]*$/i.test(s) || s.includes(".."))
  ) {
    return new NextResponse(null, { status: 404 });
  }
  const file = path.join(UPLOADS_DIR, ...segments);
  if (!file.startsWith(UPLOADS_DIR)) return new NextResponse(null, { status: 404 });
  try {
    const body = await fs.readFile(file);
    const type =
      file.endsWith(".webp") ? "image/webp"
      : file.endsWith(".png") ? "image/png"
      : file.endsWith(".jpg") || file.endsWith(".jpeg") ? "image/jpeg"
      : "application/octet-stream";
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
