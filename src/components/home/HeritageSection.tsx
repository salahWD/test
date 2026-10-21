import Image from "next/image";

/**
 * "Our heritage" — a forest-green moment chapter showing the owner's shelf of
 * Lebanese heirlooms displayed inside the shop (tarboosh, inlaid mosaic boxes,
 * brass dallah coffee pots, the cedar of the flag). Static editorial section,
 * modelled on StorySection — no parallax and no twine-knot (both are reserved
 * for the story chapter, site-wide). Sits below the retail corner.
 */
export default function HeritageSection() {
  return (
    <section
      id="heritage"
      aria-labelledby="heritage-heading"
      className="scroll-mt-20 bg-forest text-cream"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:items-center md:gap-20 md:px-10 md:py-32">
        <div className="order-2 md:order-1">
          <p className="eyebrow text-gold" data-reveal>
            Our heritage
          </p>
          <h2
            id="heritage-heading"
            className="display-section mt-4 text-cream"
            data-reveal
          >
            A little of Lebanon,
            <br />
            kept on the shelf
          </h2>
          <div className="body-copy mt-8 max-w-[52ch] space-y-5 text-[16px] leading-[1.8] text-sage">
            <p data-reveal>
              Between the tables sits a small collection close to the family:
              a felt tarboosh embroidered with the cedar, hand-inlaid mosaic
              boxes, brass dallah coffee pots worn smooth by years of pouring.
            </p>
            <p data-reveal>
              Pieces carried across the water and set out on display — so a
              corner of home is always in the room while you eat.
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2" data-reveal>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[16px] border border-cream/12 shadow-[0_2px_30px_rgba(0,0,0,0.28)]">
            <Image
              src="/images/heritage-collection.webp"
              alt="A display of Lebanese heirlooms inside The Wrap Shack — cedar-embroidered tarboosh hats, inlaid mosaic boxes, brass dallah coffee pots, and a Lebanon map plate on dark wood shelves"
              fill
              sizes="(max-width: 767px) 100vw, 52vw"
              quality={70}
              className="object-cover"
              data-reveal-img
            />
          </div>
        </div>
      </div>
    </section>
  );
}
