import Image from "next/image";
import { getHome } from "@/lib/content";

/**
 * The retail corner: Lebanese pantry staples (mouneh) sold inside the
 * restaurant — in-store only, no shipping, no cart. Server component; the
 * copy (intro, goods, tags, note) is owner-edited via the CMS home section.
 *
 * Mobile-first: the shelf photo runs full-bleed under the heading with an
 * "in-store only" chip pinned to it, and the goods become a swipeable rail
 * of kraft hang-tags (CSS scroll-snap — no JS) echoing the price tags on
 * the real shelves. Desktop keeps the editorial two-column split — the text
 * wrapper is `contents` on mobile so the photo can slot between heading and
 * copy, and a normal block inside the grid on md+.
 */

export default function MounehCorner() {
  const { intro, goods, tags, note } = getHome().mouneh;
  return (
    <section
      id="retail"
      aria-labelledby="retail-heading"
      className="grain scroll-mt-20 bg-cream"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col px-5 py-16 md:grid md:grid-cols-2 md:items-center md:gap-20 md:px-10 md:py-32">
        <div className="contents md:block">
          {/* heading block */}
          <div className="order-1">
            <p className="eyebrow text-gold-ink" data-reveal>
              The mouneh corner
            </p>
            <h2
              id="retail-heading"
              className="display-section mt-4 text-charcoal"
              data-reveal
            >
              Take a little of the
              <br />
              pantry home
            </h2>
          </div>

          {/* copy + goods */}
          <div className="order-3">
            <p
              className="body-copy mt-8 max-w-[52ch] text-charcoal-60 md:mt-6"
              data-reveal
            >
              {intro}
            </p>

            {/* mobile: the goods as a swipeable rail of shelf tags */}
            <ul
              className="scrollbar-none -mx-5 mt-6 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 mask-[linear-gradient(to_right,transparent,black_20px,black_calc(100%-28px),transparent)] md:hidden"
              aria-label="On the shelves"
              data-reveal
            >
              {tags.map((t) => (
                <li
                  key={t}
                  className="flex shrink-0 snap-start items-center gap-2.5 rounded-[9px] border border-tahini bg-garlic py-3 pl-3.5 pr-4"
                >
                  {/* the tag's punched hole */}
                  <span
                    aria-hidden
                    className="h-[7px] w-[7px] shrink-0 rounded-full bg-cream shadow-[inset_0_0_0_1.5px_var(--color-sand)]"
                  />
                  <span className="whitespace-nowrap text-[12.5px] font-semibold uppercase tracking-[0.07em] text-charcoal">
                    {t}
                  </span>
                </li>
              ))}
            </ul>

            {/* desktop: the fuller two-column list */}
            <ul
              className="mt-8 hidden gap-x-8 gap-y-3 sm:grid-cols-2 md:grid"
              data-reveal
            >
              {goods.map((g) => (
                <li
                  key={g}
                  className="flex items-baseline gap-3 text-[15.5px] leading-relaxed text-charcoal"
                >
                  <span
                    aria-hidden
                    className="h-[5px] w-[5px] shrink-0 translate-y-[-2px] rounded-full bg-sand"
                  />
                  {g}
                </li>
              ))}
            </ul>

            <p
              className="mt-8 hidden text-[13px] font-semibold uppercase tracking-[0.08em] text-charcoal-60 md:block"
              data-reveal
            >
              {note}
            </p>
          </div>
        </div>

        {/* the shelf photo — full-bleed on mobile, matted on desktop */}
        <div
          className="relative order-2 -mx-5 mt-8 md:order-0 md:mx-0 md:mt-0"
          data-reveal
        >
          <div className="relative overflow-hidden md:rounded-[16px] md:border md:border-tahini">
            <Image
              src="/images/mouneh-corner.webp"
              alt="The mouneh corner inside The Wrap Shack — dark wood shelves of Lebanese olive oil, olives, za&rsquo;atar, halva, and sweets against a deep green wall"
              width={1122}
              height={1402}
              sizes="(max-width: 767px) 100vw, 45vw"
              className="h-auto w-full"
              data-reveal-img
            />
            {/* in-store chip rides the photo on mobile; desktop states it in prose */}
            <span className="absolute bottom-4 left-4 rounded-full bg-cream/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-forest shadow-[0_1px_10px_rgba(38,36,31,0.18)] md:hidden">
              {note}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
