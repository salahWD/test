import { loadContent } from "@/lib/cms/store";
import {
  formatPrice,
  getCatering,
  getCateringLeadTime,
  formatCateringPrice,
} from "@/lib/content";

/**
 * llms.txt — a concise, factual brief for AI crawlers and answer engines
 * (per the llms.txt convention). Generated from the CMS-merged content so it
 * never drifts from the site; revalidated on every admin save.
 */

// Next 15+ no longer caches GET handlers by default — without this the brief
// would re-render (and re-read SQLite) on every crawl. Saves revalidate it
// on-demand; hourly ISR matches the marketing routes as a safety net.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const c = await loadContent();
  const s = c.site;

  const menuLines = c.categories
    .map((cat) => {
      const items = c.menu
        .filter((m) => m.category === cat.id)
        .map((m) => {
          const diet = m.dietary.length ? ` (${m.dietary.join(", ")})` : "";
          return `- ${m.name} — ${formatPrice(m)}${diet}: ${m.description}`;
        })
        .join("\n");
      return `### ${cat.label}\n${cat.note ? `${cat.note}\n` : ""}${items}`;
    })
    .join("\n\n");

  const faqLines = c.faq
    .map((f) => `### ${f.question}\n${f.answer}`)
    .join("\n\n");

  const cateringLines = getCatering()
    .map((section) => {
      const items = section.items
        .map(
          (i) =>
            `- ${i.name} — ${formatCateringPrice(i)}${i.description ? `: ${i.description}` : ""}`,
        )
        .join("\n");
      return `### ${section.label}\n${section.note ? `${section.note}\n` : ""}${items}`;
    })
    .join("\n\n");

  const body = `# ${s.name} — ${s.descriptor}

> ${s.seo.description}

${s.name} is a family-run, fast-casual Lebanese/Mediterranean restaurant in the Palm Desert area of Southern California (Coachella Valley). Every item on the menu is 100% halal. Food is made fresh daily: shawarma stacked and roasted in-house every morning, falafel fried to order, garlic sauce from a family recipe.

## Key facts

- Address: ${s.address.street}, ${s.address.locality}, ${s.address.region} ${s.address.postalCode}, ${s.address.country}
- Phone: ${s.phone}
- Email: ${s.email}
- Hours: ${s.hours.display} (${s.hours.orderingWindow})
- Ordering: online for pickup or delivery via Clover — ${c.cloverUrl}
- Catering: platters and trays for 10; order by phone 48 hours in advance
- Reservations: not taken (fast-casual counter service)
- Cuisine: ${s.cuisine.join(", ")}
- Dietary: 100% halal menu; vegan, vegetarian, and gluten-free options marked per item
${s.socials.instagram ? `- Instagram: ${s.socials.instagram}\n` : ""}- Map: ${s.mapsUrl}

## Pages

- [Home](${s.url}/): overview, signature dishes, reviews
- [Menu](${s.url}/menu): full menu with prices and dietary badges
- [Catering](${s.url}/catering): platters and trays for ten, 48-hour notice
- [Our Story](${s.url}/about): the family history and daily practice
- [Visit Us](${s.url}/contact): hours, directions, contact form, FAQ

## Menu

${menuLines}

## Catering menu (serves 10 unless noted)

${getCateringLeadTime()}

${cateringLines}

## Frequently asked questions

${faqLines}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
