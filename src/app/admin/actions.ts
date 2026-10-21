"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  cmsEnabled,
  createSession,
  destroySession,
  isAdmin,
} from "@/lib/cms/auth";
import { saveOverlaySection, loadContent } from "@/lib/cms/store";
import {
  processAndStoreMenuImage,
  sweepOrphanImages,
} from "@/lib/cms/images";
import {
  siteEditableSchema,
  menuCategorySchema,
  menuItemSchema,
  testimonialSchema,
  faqItemSchema,
  cateringSectionSchema,
  homeSchema,
} from "@/lib/cms/schema";
import { z } from "zod";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (cmsEnabled() && checkPassword(password)) {
    await createSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

async function guard(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not signed in.");
}

/** Every save revalidates the whole tree — content reaches every route. */
function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/llms.txt"); // the AEO brief mirrors CMS content
}

/** Owner-readable version of the first validation issue ("Item 3 — name: …"). */
function firstIssue(error: z.ZodError, noun: string): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid data.";
  const path = issue.path;
  const where =
    typeof path[0] === "number"
      ? `${noun} ${Number(path[0]) + 1}${path.length > 1 ? ` — ${path.slice(1).join(".")}` : ""}`
      : path.join(".");
  return `${where}: ${issue.message}`;
}

async function save<T>(
  schema: z.ZodType<T>,
  data: unknown,
  key: string,
  noun: string,
): Promise<SaveResult> {
  await guard();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error, noun) };
  await saveOverlaySection({ [key]: parsed.data });
  revalidateSite();
  return { ok: true };
}

export async function saveSite(data: unknown): Promise<SaveResult> {
  return save(siteEditableSchema, data, "site", "Field");
}

/** Categories + items validated together, written in ONE atomic overlay write —
    a bad item can never leave half the menu saved. */
export async function saveMenuAndCategories(
  categories: unknown,
  menu: unknown,
): Promise<SaveResult> {
  await guard();
  const cats = z.array(menuCategorySchema).min(1).safeParse(categories);
  if (!cats.success) return { ok: false, error: firstIssue(cats.error, "Category") };
  const items = z.array(menuItemSchema).min(1).safeParse(menu);
  if (!items.success) return { ok: false, error: firstIssue(items.error, "Item") };
  await saveOverlaySection({ categories: cats.data, menu: items.data });
  await sweepUploads();
  revalidateSite();
  return { ok: true };
}

/** Reclaim uploaded photos nothing references anymore (replace/remove/deleted
    items). Uploads are shared across menu AND catering, so the sweep reads the
    freshly-saved content bundle and keeps every URL either section still uses.
    Cleanup must never fail the save itself. */
async function sweepUploads(): Promise<void> {
  try {
    const c = await loadContent();
    await sweepOrphanImages([
      ...c.menu.map((i) => i.image),
      ...c.catering.flatMap((s) => s.items.map((i) => i.image)),
    ]);
  } catch {
    // never fail the save over cleanup
  }
}

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Store a menu photo (R2 or local fallback). The returned URL only reaches
    the public site once the owner saves the menu. */
export async function uploadMenuImage(formData: FormData): Promise<UploadResult> {
  await guard();
  const file = formData.get("file");
  const itemHint = String(formData.get("itemId") ?? "item");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "No file received." };
  if (file.size > MAX_UPLOAD_BYTES)
    return { ok: false, error: "Photo is over 8 MB — please use a smaller image." };
  if (!file.type.startsWith("image/"))
    return { ok: false, error: "That file isn't an image." };
  try {
    // sharp re-encodes (and thereby validates) the bytes — the mime check
    // above is UX, not the security boundary
    const { url } = await processAndStoreMenuImage(
      Buffer.from(await file.arrayBuffer()),
      itemHint,
    );
    return { ok: true, url };
  } catch (e) {
    console.error("[cms] upload failed:", e);
    return { ok: false, error: "Upload failed — please try again." };
  }
}

export async function saveTestimonials(data: unknown): Promise<SaveResult> {
  return save(z.array(testimonialSchema), data, "testimonials", "Review");
}

/** Catering sections + the lead-time line, validated together, one atomic write. */
export async function saveCatering(
  sections: unknown,
  leadTime: unknown,
): Promise<SaveResult> {
  await guard();
  const parsed = z.array(cateringSectionSchema).min(1).safeParse(sections);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error, "Section") };
  const lead = z.string().min(1).safeParse(leadTime);
  if (!lead.success) return { ok: false, error: "Lead-time note: cannot be empty" };
  await saveOverlaySection({ catering: parsed.data, cateringLeadTime: lead.data });
  await sweepUploads();
  revalidateSite();
  return { ok: true };
}

export async function saveFaq(data: unknown): Promise<SaveResult> {
  return save(z.array(faqItemSchema), data, "faq", "Question");
}

/** Home-page copy: hero lines, the mouneh corner, the final CTA. */
export async function saveHome(data: unknown): Promise<SaveResult> {
  return save(homeSchema, data, "home", "Field");
}
