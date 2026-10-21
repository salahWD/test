import Image from "next/image";
import {
  getCategories,
  getMenuByCategory,
  formatPrice,
  getCloverUrl,
  type MenuItem,
} from "@/lib/content";
import MenuShell from "@/components/menu/MenuShell";
import DietaryBadge from "@/components/ui/DietaryBadge";
import Divider from "@/components/ui/Divider";

/**
 * The full menu: sticky category rail + dietary filter pills, with GSAP
 * Flip layout transitions on filter changes (no jarring pops).
 *
 * SERVER component: the card list (the page's heaviest DOM) renders to
 * plain HTML and never hydrates. All interactivity lives in MenuShell,
 * which filters these cards through their data attributes.
 */
export default function MenuExplorer() {
  const categories = getCategories();
  const clover = getCloverUrl();

  return (
    <MenuShell categories={categories.map(({ id, label }) => ({ id, label }))}>
      {categories.map((cat, ci) => {
        const items = getMenuByCategory(cat.id);
        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            data-menu-category={cat.id}
            aria-labelledby={`cat-${cat.id}-h`}
            className={`scroll-mt-[150px] ${ci > 0 ? "mt-12 md:mt-20" : ""}`}
          >
            <h2
              id={`cat-${cat.id}-h`}
              className="font-display text-[clamp(2rem,3.2vw,2.8rem)] font-medium text-charcoal"
            >
              {cat.label}
            </h2>
            {/* add-on offer — a filled pill under the title so it reads as a
                deliberate offer the eye lands on, not a footnote */}
            {cat.note && (
              <p className="mt-3.5 inline-flex items-center gap-2.5 rounded-full bg-forest py-2 pl-2.5 pr-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-cream">
                <span
                  aria-hidden
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-cream/15 text-[14px] leading-none text-gold"
                >
                  +
                </span>
                {cat.note}
              </p>
            )}
            <Divider tone="olive" className="mt-4 max-w-[120px]" />

            <ul className="mt-6 grid gap-4 md:mt-8 md:gap-5 lg:grid-cols-2">
              {items.map((item, i) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  clover={clover}
                  // first cards of the first category sit above the fold —
                  // their photo is usually the page's LCP element and must
                  // be preloaded, not native-lazy
                  eager={ci === 0 && i < 2}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </MenuShell>
  );
}

function MenuCard({
  item,
  clover,
  eager = false,
}: {
  item: MenuItem;
  clover: string;
  eager?: boolean;
}) {
  return (
    <li
      data-item
      data-dietary={item.dietary.join(" ")}
      aria-hidden="false"
      className={[
        "group relative flex flex-col bg-garlic transition-colors duration-300 ease-brand hover:bg-tahini/40",
        item.featured ? "lg:col-span-2" : "",
      ].join(" ")}
    >
      <div className={item.featured ? "grid md:grid-cols-[1fr_auto]" : ""}>
        {item.image && (
          <div
            className={
              item.featured
                ? "relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-[12px] md:order-2 md:m-5 md:ml-0 md:aspect-auto md:min-h-[220px] md:w-[300px]"
                : "relative m-3 mb-0 aspect-[16/10] overflow-hidden rounded-[12px]"
            }
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority={eager}
              sizes={
                item.featured
                  ? "(max-width: 767px) 100vw, 300px"
                  : "(max-width: 1023px) 100vw, 45vw"
              }
              className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col px-5 py-5 md:px-9 md:py-8">
          {item.featured && (
            <p className="eyebrow mb-3 text-gold-ink">House favorite</p>
          )}
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-[1.35rem] font-medium leading-snug text-charcoal md:text-[1.55rem]">
              {item.name}
            </h3>
            <span
              aria-hidden
              className="mx-1 hidden flex-1 border-b border-dotted border-tahini sm:block"
            />
            <span className="shrink-0 font-medium text-charcoal">
              {formatPrice(item)}
            </span>
          </div>
          <p className="body-copy mt-2 text-[14.5px] leading-relaxed text-charcoal-60">
            {item.description}
          </p>
          {/* item-specific add-on — outlined chip, same offer language as the
              category pill but one register quieter */}
          {item.addOn && (
            <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-olive/60 bg-cream px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-forest">
              <span aria-hidden className="text-[13px] leading-none text-gold-ink">
                +
              </span>
              {item.addOn}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-3 md:pt-5">
            <span className="flex flex-wrap items-center gap-3">
              {item.dietary.map((k) => (
                <DietaryBadge key={k} kind={k} withLabel />
              ))}
            </span>
            <a
              href={clover}
              target="_blank"
              rel="noopener"
              className="hidden text-[12px] font-semibold uppercase tracking-[0.1em] text-forest underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold sm:inline"
            >
              Order Online ↗
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
