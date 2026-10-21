import { getSite } from "@/lib/content";

/**
 * Hand-styled static map in the brand's illustration language — links out to
 * Google Maps (the brief forbids loading the Maps JS SDK; a keyed static-map
 * API would add a dependency for less character).
 */
export default function BrandMap({ className = "" }: { className?: string }) {
  const site = getSite();
  return (
    <a
      href={site.mapsUrl}
      target="_blank"
      rel="noopener"
      aria-label="Open our location in Google Maps — 40100 Washington St, Bermuda Dunes"
      className={`group block overflow-hidden rounded-[14px] border border-tahini bg-garlic ${className}`}
    >
      {/* Geometry matches reality (OSM): the shop is in Bermuda Dunes Plaza on
          the SE corner of Washington St × Country Club Dr, a short hop south of
          the I-10 Washington St off-ramp. */}
      <svg viewBox="0 0 640 480" className="h-full w-full" role="img" aria-hidden>
        {/* field */}
        <rect width="640" height="480" fill="var(--color-garlic)" />

        {/* I-10 — freeway double band across the top (north) */}
        <path d="M-10 70 C 160 50, 340 46, 650 32" fill="none" stroke="var(--color-tahini)" strokeWidth="16" />
        <path d="M-10 70 C 160 50, 340 46, 650 32" fill="none" stroke="var(--color-garlic)" strokeWidth="2" strokeDasharray="10 12" />
        <text x="40" y="44" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(-4 40 44)">INTERSTATE 10</text>

        {/* off-ramp curving from I-10 down onto Washington St */}
        <path d="M262 66 C 276 108, 288 132, 292 170" fill="none" stroke="var(--color-tahini)" strokeWidth="4" strokeDasharray="6 7" opacity="0.9" />

        {/* Washington St — the N–S spine */}
        <path d="M300 -10 C 300 150, 296 330, 306 490" fill="none" stroke="var(--color-olive)" strokeWidth="7" opacity="0.9" />
        <text x="318" y="400" fill="var(--color-charcoal-60)" fontSize="12" fontWeight="600" letterSpacing="2" transform="rotate(88 318 400)">WASHINGTON ST</text>

        {/* Country Club Dr — the cross street at the corner */}
        <path d="M-10 250 C 180 244, 460 256, 650 248" fill="none" stroke="var(--color-olive)" strokeWidth="6" opacity="0.9" />
        <text x="40" y="238" fill="var(--color-charcoal-60)" fontSize="11.5" fontWeight="600" letterSpacing="2">COUNTRY CLUB DR</text>

        {/* plaza footprint — SE corner of the intersection */}
        <rect x="312" y="258" width="86" height="70" rx="4" fill="var(--color-sand)" opacity="0.28" />

        {/* little landscape strokes, logo-style */}
        <g stroke="var(--color-sage)" strokeWidth="1.4" fill="none" opacity="0.7">
          <path d="M120 330 q6 -14 12 0 M126 318 v18" />
          <path d="M470 150 q6 -14 12 0 M476 138 v18" />
          <path d="M520 400 q6 -14 12 0 M526 388 v18" />
          <path d="M92 430 q6 -14 12 0 M98 418 v18" />
        </g>

        {/* the shop — gold marker at the SE corner of Washington × Country Club */}
        <g className="transition-transform duration-300 ease-brand group-hover:-translate-y-1">
          <circle cx="330" cy="288" r="26" fill="var(--color-gold)" opacity="0.14" />
          <path
            d="M330 264 c-11 0 -18 8 -18 17 0 12 18 29 18 29 s18 -17 18 -29 c0 -9 -7 -17 -18 -17 Z"
            fill="var(--color-gold)"
          />
          <circle cx="330" cy="281" r="6" fill="var(--color-cream)" />
        </g>
        <text x="362" y="292" fill="var(--color-charcoal)" fontSize="13" fontWeight="600" letterSpacing="1.5">THE WRAP SHACK</text>
        <text x="362" y="309" fill="var(--color-charcoal-60)" fontSize="11">Bermuda Dunes Plaza · Ste 109</text>

        {/* compass */}
        <g transform="translate(588 440)" stroke="var(--color-olive)" fill="none" strokeWidth="1.4">
          <circle r="16" />
          <path d="M0 -10 L4 4 L0 1 L-4 4 Z" fill="var(--color-olive)" />
        </g>
        <text x="583" y="474" fill="var(--color-charcoal-60)" fontSize="10" fontWeight="600">N</text>
      </svg>
      <span className="block border-t border-tahini px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal-60 transition-colors duration-250 group-hover:text-forest">
        Open in Google Maps →
      </span>
    </a>
  );
}
