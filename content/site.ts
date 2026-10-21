/**
 * Business facts — single source of truth.
 * Components must consume this via `@/lib/content`, never directly.
 */

export const CLOVER_ORDER_URL =
  "https://www.clover.com/online-ordering/wrap-shack-bermuda-dunes";

export const site = {
  name: "The Wrap Shack",
  descriptor: "Mediterranean Eats",
  legalName: "The Wrap Shack",
  url: "https://itsawrapshack.com",
  cuisine: ["Lebanese", "Mediterranean", "Middle Eastern", "Halal"],

  /** Marketing location per brand positioning (SEO, copy). */
  marketingLocation: "Palm Desert",

  /** Real street address — used on the contact page and in JSON-LD. */
  address: {
    street: "40100 Washington St, Suite 109",
    locality: "Bermuda Dunes",
    region: "CA",
    postalCode: "92203",
    country: "US",
  },

  // 40100 Washington St — Bermuda Dunes Plaza, SE corner of Washington St &
  // Country Club Dr, just south of the I-10 Washington St off-ramp (OSM).
  geo: { latitude: 33.7569, longitude: -116.3029 },

  phone: "(760) 360-8178",
  phoneHref: "tel:+17603608178",
  email: "mmalak@hotmail.com",

  /** Open every day. Online ordering opens 30 min after we open and runs until close. */
  hours: {
    opens: "11:00",
    closes: "20:00",
    display: "Open daily · 11:00 am – 8:00 pm",
    orderingWindow: "Online ordering 11:30 am – 8:00 pm",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },

  mapsUrl:
    "https://maps.google.com/?q=40100+Washington+St+Suite+109,+Bermuda+Dunes,+CA+92203",

  socials: {
    instagram: "https://instagram.com/itsawrapshack" as string | null,
    // TODO(owner): Facebook profile, if any.
    facebook: null as string | null,
  },

  seo: {
    titleDefault: "The Wrap Shack · Halal Mediterranean Eats · Palm Desert",
    titleTemplate: "%s · The Wrap Shack",
    description:
      "Mediterranean wraps, shawarma, and mezza made fresh every day in the Palm Desert area. 100% Halal, family recipes, homemade garlic sauce. Order online for pickup.",
  },
} as const;

export type Site = typeof site;
