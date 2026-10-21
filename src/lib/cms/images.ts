/**
 * Menu photo storage — server only.
 *
 * Uploads are decoded and re-encoded with sharp (strips EXIF/GPS, normalizes
 * orientation, caps width, converts to webp), then stored under a
 * content-hashed key:
 *  - Cloudflare R2 (S3 API) when all five R2_* env vars are set — public URL
 *    is `${R2_PUBLIC_URL}/${key}`.
 *  - Local fallback otherwise: `data/uploads/${key}`, served at
 *    `/uploads/${key}` by the route handler in `src/app/uploads/[...path]`
 *    (NOT public/ — `next start` snapshots public/ at boot, so files written
 *    at runtime would 404 until a restart).
 *
 * Every stored object gets a row in the `images` table; after each menu or
 * catering save the orphan sweep deletes objects no longer referenced by any
 * menu item or catering tray (15-minute grace window protects just-uploaded,
 * not-yet-saved photos).
 */

import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { insertImage, findOrphanImages, deleteImageRow } from "./db";

export type StoredImage = { key: string; url: string };

type Backend = "r2" | "local";

interface ImageStorage {
  backend: Backend;
  put(key: string, body: Buffer, contentType: string): Promise<StoredImage>;
  remove(key: string): Promise<void>;
}

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

// ——— R2 (S3-compatible) ———

let s3: S3Client | null = null;
function getS3(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3;
}

const r2Storage: ImageStorage = {
  backend: "r2",
  async put(key, body, contentType) {
    await getS3().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: body,
        ContentType: contentType,
        // keys are content-hashed — safe to cache forever
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    const base = process.env.R2_PUBLIC_URL!.replace(/\/+$/, "");
    return { key, url: `${base}/${key}` };
  },
  async remove(key) {
    await getS3().send(
      new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }),
    );
  },
};

// ——— local fallback (public/uploads) ———

export const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

const localStorage: ImageStorage = {
  backend: "local",
  async put(key, body) {
    const file = path.join(UPLOADS_DIR, ...key.split("/"));
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, body);
    await fs.rename(tmp, file);
    return { key, url: `/uploads/${key}` };
  },
  async remove(key) {
    try {
      await fs.unlink(path.join(UPLOADS_DIR, ...key.split("/")));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
  },
};

export function getImageStorage(): ImageStorage {
  return r2Configured() ? r2Storage : localStorage;
}

function storageFor(backend: Backend): ImageStorage {
  return backend === "r2" ? r2Storage : localStorage;
}

// ——— processing + persistence ———

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function processAndStoreMenuImage(
  input: Buffer,
  itemHint: string,
): Promise<StoredImage> {
  const { data, info } = await sharp(input)
    .rotate() // honor EXIF orientation before it gets stripped
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 8);
  const key = `menu/${slugify(itemHint) || "item"}-${hash}.webp`;
  const storage = getImageStorage();
  const stored = await storage.put(key, data, "image/webp");
  insertImage({
    key,
    url: stored.url,
    itemId: itemHint,
    backend: storage.backend,
    size: data.length,
    width: info.width,
    height: info.height,
  });
  return stored;
}

const ORPHAN_GRACE_MS = 15 * 60 * 1000;

/**
 * Delete uploaded images no longer referenced by the given URLs. Uploads are
 * shared across sections (menu items + catering trays), so callers must pass
 * EVERY image URL the current content references — not just the section that
 * was saved. Each row is removed via the backend it was stored under. Never
 * throws — cleanup must not fail a save.
 */
export async function sweepOrphanImages(
  referencedUrls: (string | undefined)[],
): Promise<void> {
  const referenced = new Set(
    referencedUrls.filter((u): u is string => Boolean(u)),
  );
  for (const row of findOrphanImages(referenced, ORPHAN_GRACE_MS)) {
    try {
      await storageFor(row.backend).remove(row.key);
      deleteImageRow(row.key);
    } catch (e) {
      console.error("[cms] orphan image cleanup failed:", row.key, e);
    }
  }
}
