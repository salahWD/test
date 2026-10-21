import {
  getSite,
  getCloverUrl,
  getCategories,
  getMenuByCategory,
  getFaq,
  getTestimonials,
} from "@/lib/content";
import type { Dietary } from "@/lib/content";

/**
 * Structured data as ONE connected entity graph per page — Restaurant,
 * WebSite, WebPage, Menu, FAQPage, and breadcrumbs all cross-referenced by
 * stable `@id`s, so search and answer engines resolve every page back to the
 * same business entity. All values come from the content layer (CMS-aware);
 * never hand-type facts here.
 */

const DIET_MAP: Partial<Record<Dietary, string>> = {
  vegan: "https://schema.org/VeganDiet",
  vegetarian: "https://schema.org/VegetarianDiet",
  "gluten-free": "https://schema.org/GlutenFreeDiet",
};

/** Everything on the menu is halal — asserted on every single item. */
const HALAL = "https://schema.org/HalalDiet";

/** Cities the restaurant realistically serves across the Coachella Valley. */
const AREA_SERVED = [
  "Palm Desert",
  "Bermuda Dunes",
  "La Quinta",
  "Indian Wells",
  "Indio",
  "Rancho Mirage",
  "Palm Springs",
];

function ids() {
  const url = getSite().url;
  return {
    restaurant: `${url}/#restaurant`,
    website: `${url}/#website`,
    menu: `${url}/menu#menu`,
  };
}

function restaurantNode() {
  const site = getSite();
  const id = ids();
  const sameAs = [site.socials.instagram, site.socials.facebook].filter(Boolean);
  const reviews = getTestimonials();
  const ratings = reviews.map((r) => r.rating ?? 5);
  const avg = ratings.reduce((a, b) => a + b, 0) / (ratings.length || 1);
  return {
    "@type": "Restaurant",
    "@id": id.restaurant,
    name: site.name,
    alternateName: `${site.name} — ${site.descriptor}`,
    description: site.seo.description,
    url: site.url,
    image: [
      `${site.url}/og.jpg`,
      `${site.url}/images/dishes/chicken-shawarma.webp`,
      `${site.url}/images/dishes/beef-gyro.webp`,
    ],
    logo: `${site.url}/brand/logo.png`,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    servesCuisine: site.cuisine,
    acceptsReservations: false,
    priceRange: "$$",
    currenciesAccepted: "USD",
    hasMenu: { "@id": id.menu },
    hasMap: site.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: AREA_SERVED.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    // machine-readable "order online" — pickup via Clover
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: getCloverUrl(),
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
        inLanguage: "en-US",
      },
      deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModePickUp"],
    },
    ...(reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: reviews.length,
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.attribution },
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(r.rating ?? 5),
              bestRating: "5",
            },
            reviewBody: r.quote,
          })),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

function websiteNode() {
  const site = getSite();
  const id = ids();
  return {
    "@type": "WebSite",
    "@id": id.website,
    url: site.url,
    name: `${site.name} · ${site.descriptor}`,
    description: site.seo.description,
    publisher: { "@id": id.restaurant },
    inLanguage: "en-US",
  };
}

function menuNode() {
  const site = getSite();
  const id = ids();
  return {
    "@type": "Menu",
    "@id": id.menu,
    name: `${site.name} Menu`,
    url: `${site.url}/menu`,
    inLanguage: "en-US",
    hasMenuSection: getCategories().map((cat) => ({
      "@type": "MenuSection",
      name: cat.label,
      ...(cat.note ? { description: cat.note } : {}),
      hasMenuItem: getMenuByCategory(cat.id).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        ...(item.price !== null
          ? {
              offers: {
                "@type": "Offer",
                price: item.price.toFixed(2),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
        suitableForDiet: [
          HALAL,
          ...item.dietary.map((d) => DIET_MAP[d]).filter(Boolean),
        ],
      })),
    })),
  };
}

function faqNode(path: string) {
  const site = getSite();
  return {
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    mainEntity: getFaq().map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function breadcrumbNode(path: string, crumbs: { name: string; path: string }[]) {
  const site = getSite();
  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${path}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${site.url}${c.path}`,
      })),
    ],
  };
}

export interface PageGraphInput {
  /** Route path, e.g. "/menu". "" or "/" for home. */
  path: string;
  title: string;
  description: string;
  /** Schema.org WebPage subtype. */
  pageType?: "WebPage" | "AboutPage" | "ContactPage";
  breadcrumbs?: { name: string; path: string }[];
  withMenu?: boolean;
  withFaq?: boolean;
}

/** The complete, connected graph for one page. */
export function pageGraph(input: PageGraphInput) {
  const site = getSite();
  const id = ids();
  const path = input.path === "/" ? "" : input.path;
  const graph: object[] = [restaurantNode(), websiteNode()];

  graph.push({
    "@type": input.pageType ?? "WebPage",
    "@id": `${site.url}${path}/#webpage`,
    url: `${site.url}${path || "/"}`,
    name: input.title,
    description: input.description,
    isPartOf: { "@id": id.website },
    about: { "@id": id.restaurant },
    inLanguage: "en-US",
    ...(input.breadcrumbs?.length
      ? { breadcrumb: { "@id": `${site.url}${path}#breadcrumb` } }
      : {}),
  });

  if (input.breadcrumbs?.length)
    graph.push(breadcrumbNode(path, input.breadcrumbs));
  if (input.withMenu) graph.push(menuNode());
  if (input.withFaq) graph.push(faqNode(path));

  return { "@context": "https://schema.org", "@graph": graph };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((d, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
    />
  ));
}
