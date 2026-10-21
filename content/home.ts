/**
 * Home-page copy the owner edits from the CMS: the hero lines, the mouneh
 * retail corner, and the final call-to-action. Everything else on the page
 * (section structure, images, motion) stays code-owned.
 */

export interface HomeHero {
  /** small gold line above the headline */
  eyebrow: string;
  /** headline, first line */
  headlineTop: string;
  /** headline, second line (rendered italic) */
  headlineBottom: string;
  /** the italic line that drifts through mid-scroll */
  caption: string;
}

export interface HomeMouneh {
  /** intro paragraph under the heading */
  intro: string;
  /** the fuller list shown on desktop */
  goods: string[];
  /** short shelf-tag chips for the mobile swipe rail */
  tags: string[];
  /** the "in-store only" line / photo chip */
  note: string;
}

export interface HomeFinalCta {
  eyebrow: string;
  /** headline, first line */
  headlineTop: string;
  /** headline, second line (rendered italic) */
  headlineItalic: string;
  /** body copy — the ordering window is appended automatically */
  body: string;
}

export interface HomeContent {
  hero: HomeHero;
  mouneh: HomeMouneh;
  finalCta: HomeFinalCta;
}

export const home: HomeContent = {
  hero: {
    eyebrow: "Palm Desert · 100% Halal",
    headlineTop: "Mediterranean soul.",
    headlineBottom: "California sun.",
    caption: "wrapped fresh, every single moment",
  },
  mouneh: {
    intro:
      "Mouneh is the Lebanese pantry — the shelf of things a kitchen never lets run out. Ours stands right inside the restaurant, stocked with the staples we cook from every day.",
    goods: [
      "Zeit zaytoun — Lebanese extra-virgin olive oil",
      "Za’atar & seven-spice blends",
      "Olives, pickles & stuffed grape leaves",
      "Halva, Turkish delight & baklava",
      "Lebanese coffee & sesame breadsticks",
      "Tahini, falafel mix & more",
    ],
    tags: [
      "Zeit zaytoun",
      "Za’atar",
      "Seven-spice",
      "Olives & pickles",
      "Grape leaves",
      "Halva",
      "Turkish delight",
      "Baklava",
      "Lebanese coffee",
      "Tahini",
      "Falafel mix",
      "Breadsticks",
    ],
    note: "In-store only — ask at the counter",
  },
  finalCta: {
    eyebrow: "Ready when you are",
    headlineTop: "Skip the line.",
    headlineItalic: "Not the garlic sauce.",
    body: "Order ahead for pickup or delivery — wrapped in kraft, and hot when it reaches you.",
  },
};
