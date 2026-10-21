import type { Metadata } from "next";
import Image from "next/image";
import PullLine from "@/components/motion/PullLine";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import { getCloverUrl } from "@/lib/content";
import { loadContent } from "@/lib/cms/store";
import { JsonLd, pageGraph } from "@/lib/jsonld";

const TITLE = "Our Story · Mediterranean Kitchen in the Desert";
const DESCRIPTION =
  "The Wrap Shack is a family-run Mediterranean kitchen in the Palm Desert area — shawarma stacked daily, fresh local ingredients, vegan options, garlic sauce from a family recipe, everything 100% halal.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    title: "Stacked every morning",
    body: "The shawarma spit is built by hand daily — marinated overnight, layered at dawn, roasted slow until service.",
  },
  {
    title: "A sauce with a lineage",
    body: "Our garlic sauce follows a family recipe from Middle East. Small batches, real garlic, no shortcuts, no jars.",
  },
  {
    title: "Halal, entirely",
    body: "Not a section of the menu — the whole menu. Every protein, every plate, every day.",
  },
  {
    title: "Fresh over fast",
    body: "Falafel fried when you order it. Bread warmed when you're here. Salads dressed at the last minute.",
  },
] as const;

export default async function AboutPage() {
  await loadContent(); // prime the content snapshot before anything renders
  const clover = getCloverUrl();
  return (
    <>
      <JsonLd
        data={pageGraph({
          path: "/about",
          title: TITLE,
          description: DESCRIPTION,
          pageType: "AboutPage",
          breadcrumbs: [{ name: "Our Story", path: "/about" }],
        })}
      />
      {/* opening chapter: split grid — story left, spit image right */}
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-5 pb-16 pt-28 md:grid-cols-[1fr_380px] md:items-start md:gap-16 md:px-10 md:pb-32 md:pt-44">
          <div>
            {/* Above the fold: no [data-reveal] here — this copy is the page's
                LCP and must paint with the HTML, not after GSAP idles in. The
                eyebrow's CSS entrance carries the choreography (home-hero rule). */}
            <p className="eyebrow hero-enter text-gold">Our story</p>
            <h1 className="sr-only">Our Story — The Wrap Shack</h1>
            <PullLine
              immediate
              className="mt-6 text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.12]"
            >
              A Mediterranean kitchen that crossed an ocean and kept its accent.
            </PullLine>
            <div className="body-copy mt-8 space-y-5 md:mt-10 md:space-y-6 text-[16.5px] leading-[1.85] text-sage">
              <p>
                The Wrap Shack began the way most Mediterranean cooking does — at a
                family table, with recipes nobody ever wrote down properly because
                everybody already knew them. When our family settled in the
                Coachella Valley, the recipes came along: the seven-spice blend,
                the overnight marinades, the garlic sauce whipped patiently until
                it stands on its own.
              </p>
              <p>
                We opened on Washington Street to cook that food the way it
                deserves — fast enough for a lunch break, never faster than the
                food allows.
              </p>
              <p>
                The menu leans fresh and health-conscious: local ingredients
                where the valley provides them, a deep bench of vegan options
                led by our falafel, and a freshly prepared tahini sauce that
                sharpens anything it touches. Regulars argue over the star —
                the chicken shawarma, or the beef gyro seared and folded with
                fresh tzatziki. Come taste why the Coachella Valley treats us
                as its go-to for Mediterranean eats.
              </p>
            </div>
          </div>
          {/* spit image — ties to "stacked every morning" heritage narrative */}
          <div
            className="hero-enter relative aspect-[4/5] overflow-hidden rounded-[14px] md:rounded-b-[14px] md:rounded-t-[190px]"
            style={{ animationDelay: "0.15s" }}
          >
            <Image
              src="/images/story-ingredients.webp"
              alt="Shawarma spit roasting slowly beside fresh pita and herbs"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 380px"
              quality={60}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* editorial image triptych — three kitchen moments */}
      <section aria-hidden className="bg-cream py-10 md:py-16">
        <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-3 px-5 md:gap-5 md:px-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl" data-reveal>
            <Image
              src="/images/gallery/wrap-build.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 33vw, 340px"
              quality={60}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl" data-reveal>
            <Image
              src="/images/gallery/falafel-pita.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 33vw, 340px"
              quality={60}
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl" data-reveal>
            <Image
              src="/images/gallery/wrap-sauce.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 33vw, 340px"
              quality={60}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* the daily practice */}
      <section aria-labelledby="values-heading" className="grain bg-cream">
        <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-32">
          <p className="eyebrow text-gold-ink" data-reveal>
            The daily practice
          </p>
          <h2 id="values-heading" className="display-section mt-4 text-charcoal" data-reveal>
            What &ldquo;fresh daily&rdquo; actually means here
          </h2>
          <div className="mt-10 grid gap-x-16 gap-y-8 md:mt-14 md:grid-cols-2 md:gap-y-12">
            {VALUES.map((v) => (
              <div key={v.title} data-reveal>
                <Divider tone="olive" className="max-w-[64px]" />
                <h3 className="mt-5 font-display text-[1.7rem] font-medium text-charcoal">
                  {v.title}
                </h3>
                <p className="body-copy mt-3 text-[15.5px] leading-relaxed text-charcoal-60">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4 md:mt-16" data-reveal>
            <Button href="/menu" variant="outline">
              See the menu
            </Button>
            <Button href={clover} external>
              Order Online
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
