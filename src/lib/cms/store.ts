/**
 * CMS store — server only (SQLite via ./db; never import from client
 * components).
 *
 * Content lives in `data/cms/cms.db` (one row per section, JSON text; see
 * db.ts). Sections present in the DB replace their seed from `content/*`
 * wholesale; missing sections fall back to the seed, so the site runs
 * identically with an empty database. A legacy `content.json` overlay is
 * migrated automatically on first open.
 *
 * NOTE: requires a persistent Node server (`next start`). On ephemeral
 * serverless filesystems, edits will not survive a redeploy.
 */

import { cache } from "react";
import {
  defaultBundle,
  __setContent,
  type ContentBundle,
  type SiteData,
} from "@/lib/content";
import { overlaySchema, type Overlay } from "./schema";
import { readSections, writeSections, latestSavedAt } from "./db";

function readOverlay(): Overlay | null {
  const sections = readSections();
  if (Object.keys(sections).length === 0) return null;
  const parsed = overlaySchema.safeParse(sections);
  if (parsed.success) return parsed.data;
  console.error("[cms] stored content failed validation — using seeds:", parsed.error.message);
  return null;
}

function mergeSite(base: SiteData, o: NonNullable<Overlay["site"]>): SiteData {
  return {
    ...base,
    phone: o.phone,
    phoneHref: o.phoneHref,
    email: o.email,
    hours: { ...base.hours, ...o.hours },
    socials: o.socials,
  };
}

/**
 * Merged content for the current request (deduped via React cache). Also
 * primes the accessor snapshot in `lib/content.ts`, so call this at the top
 * of every page/layout that renders content.
 */
export const loadContent = cache(async (): Promise<ContentBundle> => {
  const overlay = readOverlay();
  const bundle: ContentBundle = !overlay
    ? defaultBundle
    : {
        site: overlay.site
          ? mergeSite(defaultBundle.site, overlay.site)
          : defaultBundle.site,
        cloverUrl: overlay.site?.cloverUrl ?? defaultBundle.cloverUrl,
        categories: overlay.categories ?? defaultBundle.categories,
        menu: overlay.menu ?? defaultBundle.menu,
        testimonials: overlay.testimonials ?? defaultBundle.testimonials,
        faq: overlay.faq ?? defaultBundle.faq,
        catering: overlay.catering ?? defaultBundle.catering,
        cateringLeadTime: overlay.cateringLeadTime ?? defaultBundle.cateringLeadTime,
        home: overlay.home ?? defaultBundle.home,
      };
  __setContent(bundle);
  return bundle;
});

/** Persist the given sections (one SQLite transaction — atomic like the old
    tmp+rename write, but only the touched sections change). */
export async function saveOverlaySection(patch: Partial<Overlay>): Promise<void> {
  const { savedAt: _ignored, ...sections } = patch;
  writeSections(sections);
}

/** Store metadata for the admin dashboard. */
export async function overlayStatus(): Promise<{
  exists: boolean;
  savedAt: string | null;
}> {
  const savedAt = latestSavedAt();
  return { exists: savedAt !== null, savedAt };
}
