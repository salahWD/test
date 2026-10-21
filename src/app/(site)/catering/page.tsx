import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getSite,
  getCatering,
  getCateringLeadTime,
  formatCateringPrice,
} from "@/lib/content";
import { loadContent } from "@/lib/cms/store";
import { JsonLd, pageGraph } from "@/lib/jsonld";
import Divider from "@/components/ui/Divider";
import PullLine from "@/components/motion/PullLine";

const TITLE = "Catering · Mediterranean Platters & Trays";
const DESCRIPTION =
  "Halal Mediterranean catering in the Palm Desert area — shawarma and gyro platters, mixed grill skewers, mezza trays, salads, and baklava, built for ten. Call 48 hours ahead.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/catering" },
};

export default async function CateringPage() {
  await loadContent(); // prime the content snapshot before anything renders
  const site = getSite();
  const sections = getCatering();
  const leadTime = getCateringLeadTime();

  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/catering",
          title: TITLE,
          description: DESCRIPTION,
          breadcrumbs: [{ name: "Catering", path: "/catering" }],
        })}
      />

      {/* opening chapter */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-5 pb-14 pt-28 md:grid-cols-[1fr_380px] md:items-center md:gap-16 md:px-10 md:pb-24 md:pt-44">
          <div>
            {/* Above the fold: no [data-reveal] — LCP copy paints with the
                HTML; eyebrow + CTA carry the CSS entrance (home-hero rule). */}
            <p className="eyebrow hero-enter text-gold">Catering</p>
            <h1 className="sr-only">Catering — The Wrap Shack</h1>
            <PullLine
              immediate
              className="mt-6 text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.12]"
            >
              Feed the whole family. We&rsquo;ll bring the spit&rsquo;s best.
            </PullLine>
            <p className="body-copy mt-8 max-w-[58ch] text-[16.5px] leading-[1.85] text-sage">
              Platters, bowls, and mezza trays built for ten — shawarma off the
              spit, skewers from the grill, dips with warm pita, baklava to
              finish. Everything 100% halal, cooked the same way we cook for the
              counter.
            </p>
            <div
              className="hero-enter mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-10"
              style={{ animationDelay: "0.24s" }}
            >
              <a
                href={site.phoneHref}
                className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
              >
                Call {site.phone}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-tahini">
                {leadTime}
              </p>
            </div>
          </div>
          {/* priority image, above the fold on desktop — never [data-reveal] */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] md:aspect-[4/5] md:rounded-b-[14px] md:rounded-t-[190px]">
            <Image
              src="/images/menu/lamb-chop-plate.webp"
              alt="Grilled lamb chops over saffron rice with hummus, salad, and pita"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 380px"
              quality={60}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* the menu */}
      <div className="grain bg-cream">
        <div className="mx-auto max-w-[900px] px-5 pb-16 pt-12 md:px-10 md:pb-28 md:pt-20">
          {sections.map((section, si) => (
            <section
              key={section.id}
              aria-labelledby={`catering-${section.id}`}
              className={si > 0 ? "mt-12 md:mt-20" : ""}
            >
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <h2
                  id={`catering-${section.id}`}
                  className="font-display text-[clamp(2rem,3.2vw,2.8rem)] font-medium text-charcoal"
                >
                  {section.label}
                </h2>
                {section.note && (
                  <p className="text-[13px] text-charcoal-60">{section.note}</p>
                )}
              </div>
              <Divider tone="olive" className="mt-4 max-w-[120px]" />

              {/* no per-row reveals — long price lists read instantly,
                  same as the full menu page */}
              <ul className="mt-6 md:mt-8">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-tahini/60 py-4 first:border-t md:py-5"
                  >
                    <div className={item.image ? "flex items-start gap-4 md:gap-6" : undefined}>
                      {item.image && (
                        <div className="relative aspect-4/3 w-[96px] shrink-0 overflow-hidden rounded-[10px] border border-tahini/70 md:w-[140px]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="140px"
                            quality={70}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-display text-[1.35rem] font-medium leading-snug text-charcoal md:text-[1.5rem]">
                            {item.name}
                          </h3>
                          <span
                            aria-hidden
                            className="mx-1 flex-1 border-b border-dotted border-tahini"
                          />
                          <span className="shrink-0 font-medium text-charcoal">
                            {formatCateringPrice(item)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="body-copy mt-1.5 max-w-[58ch] text-[14.5px] leading-relaxed text-charcoal-60">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* closing call band */}
      <section aria-labelledby="catering-cta" className="bg-forest text-cream">
        <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-10 md:py-24">
          <p className="eyebrow text-gold" data-reveal>
            Two days&rsquo; notice, that&rsquo;s all
          </p>
          <h2
            id="catering-cta"
            className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.08]"
            data-reveal
          >
            Tell us the date. The spit does the rest.
          </h2>
          <p className="body-copy mt-5 text-[15.5px] leading-relaxed text-sage" data-reveal>
            {leadTime}{" "}
            We&rsquo;ll walk you through portions and pickup or drop-off.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4" data-reveal>
            <a
              href={site.phoneHref}
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
            >
              Call {site.phone}
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-[13px] font-semibold uppercase tracking-[0.1em] text-tahini underline decoration-tahini/50 underline-offset-4 transition-colors duration-250 hover:text-cream"
            >
              {site.email}
            </a>
          </div>
          <p className="mt-8 text-[14px] text-sage" data-reveal>
            Just here for lunch?{" "}
            <Link
              href="/menu"
              className="text-cream underline decoration-tahini/50 underline-offset-4 transition-colors duration-250 hover:decoration-gold"
            >
              See the everyday menu
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
