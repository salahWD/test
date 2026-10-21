/**
 * CMS database — server only (better-sqlite3; never import from client
 * components).
 *
 * One SQLite file at `data/cms/cms.db` holds:
 *  - `sections`: one row per overlay section, value stored as JSON text.
 *    Zod (`overlaySchema`) remains the read/write contract — the DB is dumb
 *    storage, exactly like the JSON file it replaced.
 *  - `images`: metadata for owner-uploaded photos (R2 or local fallback),
 *    used by the orphan sweep after menu saves.
 *
 * On first open, a legacy `data/cms/content.json` overlay (the pre-SQLite
 * store) is imported once and renamed to `content.json.migrated`.
 */

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { overlaySchema } from "./schema";

const DIR = path.join(process.cwd(), "data", "cms");
const DB_PATH = path.join(DIR, "cms.db");
const LEGACY_JSON = path.join(DIR, "content.json");

export const SECTION_KEYS = [
  "site",
  "categories",
  "menu",
  "testimonials",
  "faq",
  "catering",
  "cateringLeadTime",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type ImageRow = {
  key: string;
  url: string;
  item_id: string | null;
  backend: "r2" | "local";
  size: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
};

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS sections (
  section  TEXT PRIMARY KEY,
  json     TEXT NOT NULL,
  saved_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS images (
  key        TEXT PRIMARY KEY,
  url        TEXT NOT NULL,
  item_id    TEXT,
  backend    TEXT NOT NULL DEFAULT 'local',
  size       INTEGER,
  width      INTEGER,
  height     INTEGER,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS images_url ON images(url);
`;

/** Import the pre-SQLite JSON overlay exactly once, then archive it. */
function migrateLegacyJson(db: Database.Database): void {
  if (!fs.existsSync(LEGACY_JSON)) return;
  const count = db.prepare("SELECT COUNT(*) AS n FROM sections").get() as { n: number };
  if (count.n > 0) return;
  let overlay;
  try {
    const parsed = overlaySchema.safeParse(
      JSON.parse(fs.readFileSync(LEGACY_JSON, "utf8")),
    );
    if (!parsed.success) {
      console.error("[cms] legacy overlay failed validation — not migrated:", parsed.error.message);
      return;
    }
    overlay = parsed.data;
  } catch (e) {
    console.error("[cms] legacy overlay is not valid JSON — not migrated:", e);
    return;
  }
  const savedAt = overlay.savedAt ?? new Date().toISOString();
  const insert = db.prepare(
    "INSERT INTO sections (section, json, saved_at) VALUES (?, ?, ?)",
  );
  db.transaction(() => {
    for (const key of SECTION_KEYS) {
      const value = overlay[key];
      if (value !== undefined) insert.run(key, JSON.stringify(value), savedAt);
    }
  })();
  // archive only after the transaction committed — a crash mid-import leaves
  // the JSON in place and the empty-table check retries on next boot
  fs.renameSync(LEGACY_JSON, `${LEGACY_JSON}.migrated`);
  console.log("[cms] migrated content.json into cms.db");
}

/** Singleton on globalThis so dev HMR re-evaluation doesn't leak handles. */
export function getDb(): Database.Database {
  const g = globalThis as typeof globalThis & { __cmsDb?: Database.Database };
  if (g.__cmsDb) return g.__cmsDb;
  fs.mkdirSync(DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA_SQL);
  migrateLegacyJson(db);
  g.__cmsDb = db;
  return db;
}

// ——— sections ———

export function readSections(): Partial<Record<SectionKey, unknown>> {
  const rows = getDb()
    .prepare("SELECT section, json FROM sections")
    .all() as { section: string; json: string }[];
  const out: Partial<Record<SectionKey, unknown>> = {};
  for (const row of rows) {
    try {
      out[row.section as SectionKey] = JSON.parse(row.json);
    } catch {
      console.error("[cms] corrupt section row skipped:", row.section);
    }
  }
  return out;
}

/** Upsert the given sections in one transaction with a shared timestamp. */
export function writeSections(patch: Record<string, unknown>): void {
  const db = getDb();
  const savedAt = new Date().toISOString();
  const upsert = db.prepare(
    `INSERT INTO sections (section, json, saved_at) VALUES (?, ?, ?)
     ON CONFLICT(section) DO UPDATE SET json = excluded.json, saved_at = excluded.saved_at`,
  );
  db.transaction(() => {
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      upsert.run(key, JSON.stringify(value), savedAt);
    }
  })();
}

export function latestSavedAt(): string | null {
  const row = getDb()
    .prepare("SELECT MAX(saved_at) AS at FROM sections")
    .get() as { at: string | null };
  return row.at;
}

// ——— images ———

export function insertImage(row: {
  key: string;
  url: string;
  itemId: string;
  backend: "r2" | "local";
  size: number;
  width: number;
  height: number;
}): void {
  getDb()
    .prepare(
      `INSERT INTO images (key, url, item_id, backend, size, width, height, created_at)
       VALUES (@key, @url, @itemId, @backend, @size, @width, @height, @createdAt)
       ON CONFLICT(key) DO UPDATE SET url = excluded.url, item_id = excluded.item_id`,
    )
    .run({ ...row, createdAt: new Date().toISOString() });
}

/**
 * Uploaded images no longer referenced by any menu item and older than the
 * grace window (protects a just-uploaded photo that hasn't been saved yet).
 */
export function findOrphanImages(
  referencedUrls: ReadonlySet<string>,
  olderThanMs: number,
): ImageRow[] {
  const rows = getDb().prepare("SELECT * FROM images").all() as ImageRow[];
  const cutoff = Date.now() - olderThanMs;
  return rows.filter(
    (r) =>
      !referencedUrls.has(r.url) && new Date(r.created_at).getTime() < cutoff,
  );
}

export function deleteImageRow(key: string): void {
  getDb().prepare("DELETE FROM images WHERE key = ?").run(key);
}
