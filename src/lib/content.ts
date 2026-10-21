/**
 * Thin accessor layer over site content. Components import from HERE, never
 * from `content/*` directly.
 *
 * The accessors read a module-level SNAPSHOT. It starts as the typed seed
 * files in `content/` and is replaced by the CMS-merged bundle:
 *  - on the server, `lib/cms/store.ts#loadContent()` (called by layout/pages)
 *  - on the client, `<ContentHydrator>` at the top of the tree
 * so every component — server or client — sees the same data with no prop
 * drilling, and the site works untouched when no CMS overlay exists.
 */

import { site as seedSite, CLOVER_ORDER_URL } from "@content/site";
import {
  categories as seedCategories,
  menu as seedMenu,
  type CategoryId,
  type Dietary,
  type MenuCategory,
  type MenuItem,
} from "@content/menu";
import { testimonials as seedTestimonials, type Testimonial } from "@content/testimonials";
import { faq as seedFaq, type FaqItem } from "@content/faq";
import {
  catering as seedCatering,
  CATERING_LEAD_TIME,
  type CateringSection,
  type CateringItem,
} from "@content/catering";
import {
  home as seedHome,
  type HomeContent,
  type HomeHero,
  type HomeMouneh,
  type HomeFinalCta,
} from "@content/home";

export type {
  CategoryId,
  Dietary,
  MenuCategory,
  MenuItem,
  Testimonial,
  FaqItem,
  CateringSection,
  CateringItem,
  HomeContent,
  HomeHero,
  HomeMouneh,
  HomeFinalCta,
};

/** `content/site.ts` with its literal types widened for CMS-edited values. */
export interface SiteData {
  name: string;
  descriptor: string;
  legalName: string;
  url: string;
  cuisine: readonly string[];
  marketingLocation: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo: { latitude: number; longitude: number };
  phone: string;
  phoneHref: string;
  email: string;
  hours: {
    opens: string;
    closes: string;
    display: string;
    orderingWindow: string;
    days: readonly string[];
  };
  mapsUrl: string;
  socials: { instagram: string | null; facebook: string | null };
  seo: { titleDefault: string; titleTemplate: string; description: string };
}

export interface ContentBundle {
  site: SiteData;
  cloverUrl: string;
  categories: MenuCategory[];
  menu: MenuItem[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  catering: CateringSection[];
  cateringLeadTime: string;
  home: HomeContent;
}

export const defaultBundle: ContentBundle = {
  site: seedSite,
  cloverUrl: CLOVER_ORDER_URL,
  categories: seedCategories,
  menu: seedMenu,
  testimonials: seedTestimonials,
  faq: seedFaq,
  catering: seedCatering,
  cateringLeadTime: CATERING_LEAD_TIME,
  home: seedHome,
};

let current: ContentBundle = defaultBundle;

/**
 * Internal — called by the CMS store (server, full bundle) and
 * ContentHydrator (client, partial). Partial merges let each page hydrate
 * only the sections its client components actually read (the seeds below
 * remain the fallback), instead of shipping the whole CMS bundle in every
 * page's flight payload and re-parsing it during hydration.
 */
export function __setContent(bundle: Partial<ContentBundle>) {
  current = { ...current, ...bundle };
}

export function getSite(): SiteData {
  return current.site;
}

export function getCloverUrl() {
  return current.cloverUrl;
}

export function getCategories(): MenuCategory[] {
  return current.categories;
}

export function getMenu(): MenuItem[] {
  return current.menu;
}

export function getMenuByCategory(id: CategoryId): MenuItem[] {
  return current.menu.filter((m) => m.category === id);
}

export function getFeaturedItems(): MenuItem[] {
  return current.menu.filter((m) => m.featured);
}

/** Curated homepage preview: a spread across categories, featured first. */
export function getMenuPreview(count = 8): MenuItem[] {
  const featured = current.menu.filter((m) => m.featured);
  const rest = current.menu.filter((m) => !m.featured);
  return [...featured, ...rest].slice(0, count);
}

export function getTestimonials(): Testimonial[] {
  return current.testimonials;
}

export function getFaq(): FaqItem[] {
  return current.faq;
}

export function getCatering(): CateringSection[] {
  return current.catering;
}

export function getCateringLeadTime(): string {
  return current.cateringLeadTime;
}

export function getHome(): HomeContent {
  return current.home;
}

export function formatCateringPrice(item: CateringItem): string {
  return `$${item.price.toFixed(2).replace(/\.00$/, "")}`;
}

export function formatPrice(item: MenuItem): string {
  if (item.price === null) return "ask in store";
  const dollars = item.price.toFixed(2).replace(/\.00$/, "");
  return item.priceNote
    ? `${item.priceNote} $${dollars}`
    : `$${dollars}`;
}
