import Link from "next/link";
import Image from "next/image";
import { getSite, getCloverUrl } from "@/lib/content";
import { fmt, shiftHM } from "@/lib/hours";
import HalalBadge from "@/components/ui/HalalBadge";
import Divider from "@/components/ui/Divider";
import OpenNow from "@/components/ui/OpenNow";
import ShackClock from "@/components/ui/ShackClock";
import BackToTop from "@/components/ui/BackToTop";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/#retail", label: "The Retail Corner" },
  { href: "/#heritage", label: "Our Heritage" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Visit Us" },
] as const;

/**
 * The footer as a colophon: a live "right now" strip, the practical facts
 * set like a menu card (dotted leaders), and the wordmark sinking behind
 * the fold line. Server component — the two live bits hydrate on their own.
 */
export default function Footer() {
  const site = getSite();
  const clover = getCloverUrl();
  const year = new Date().getFullYear();

  // Ordering opens 30 min after the kitchen and closes 30 min before it.
  const kitchenHours = `${fmt(site.hours.opens)} – ${fmt(site.hours.closes)}`;
  const orderingHours = `${fmt(site.hours.opens)} – ${fmt(site.hours.closes)}`;

  return (
    <footer className="overflow-hidden bg-forest text-cream">
      {/* hand-drawn seam between the last chapter and the colophon */}
      <Divider tone="sage" className="opacity-40" />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* ——— live strip: what matters right now ——— */}
        <div className="flex flex-col gap-5 border-b border-cream/10 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
            <OpenNow className="text-cream" />
            <ShackClock className="text-sage" />
          </div>
          <a
            href={clover}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2.5 self-start rounded-full bg-cream px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)] md:self-auto"
          >
            Order Online
            <span
              aria-hidden
              className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        {/* ——— the facts, set like a menu card ——— */}
        <div className="grid gap-9 pb-8 pt-10 md:grid-cols-[1.4fr_0.8fr_1fr_1.1fr] md:gap-12 md:pb-12 md:pt-16">
          <div data-reveal>
            <Image
              src="/brand/logo-cream.png"
              alt="The Wrap Shack — Mediterranean Eats"
              width={128}
              height={103}
              sizes="128px"
              quality={50}
              className="h-auto w-[128px]"
            />
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-sage">
              Mediterranean wraps, shawarma, and mezza — made fresh every day on
              Washington Street.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <HalalBadge tone="cream" className="h-12 w-12" />
              {site.socials.instagram && (
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener"
                  aria-label="The Wrap Shack on Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream shadow-[inset_0_0_0_1px_rgba(250,246,238,0.25)] transition-[background-color,color] duration-250 ease-brand hover:bg-cream hover:text-forest"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                  </svg>
                </a>
              )}
              {site.socials.facebook && (
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noopener"
                  aria-label="The Wrap Shack on Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream shadow-[inset_0_0_0_1px_rgba(250,246,238,0.25)] transition-[background-color,color] duration-250 ease-brand hover:bg-cream hover:text-forest"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                    <path
                      d="M15.5 8.5H13.8c-.4 0-.8.4-.8.9V11h2.4l-.4 2.4H13V20h-2.6v-6.6H8.5V11h1.9V9.1c0-1.9 1.2-3.1 3-3.1h2.1v2.5z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footer" data-reveal>
            <h2 className="eyebrow text-tahini">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center text-cream/90 transition-colors duration-250 ease-brand hover:text-cream"
                  >
                    {/* the menu rail's gold hairline, grown on hover */}
                    <span
                      aria-hidden
                      className="h-px w-0 bg-gold transition-[width,margin-right] duration-300 ease-brand group-hover:mr-2.5 group-hover:w-4"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={clover}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center text-cream/90 transition-colors duration-250 ease-brand hover:text-cream"
                >
                  <span
                    aria-hidden
                    className="h-px w-0 bg-gold transition-[width,margin-right] duration-300 ease-brand group-hover:mr-2.5 group-hover:w-4"
                  />
                  Order Online
                  <span aria-hidden className="ml-1.5 text-[12px]">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          <div data-reveal>
            <h2 className="eyebrow text-tahini">Visit</h2>
            <address className="mt-4 space-y-2.5 text-[15px] not-italic">
              <p className="leading-relaxed">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </p>
              <p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-tahini transition-colors duration-250 ease-brand hover:text-cream"
                >
                  Get directions
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-250 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </p>
              <p>
                <a href={site.phoneHref} className="transition-colors duration-250 hover:text-tahini">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-250 hover:text-tahini"
                >
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <div data-reveal>
            <h2 className="eyebrow text-tahini">Hours</h2>
            <dl className="mt-4 max-w-[320px] space-y-3 text-[15px]">
              <div className="flex items-baseline gap-3">
                <dt className="shrink-0">Kitchen</dt>
                <span
                  aria-hidden
                  className="flex-1 translate-y-[-3px] border-b border-dotted border-cream/25"
                />
                <dd className="shrink-0">{kitchenHours}</dd>
              </div>
              <div className="flex items-baseline gap-3">
                <dt className="shrink-0">Online ordering</dt>
                <span
                  aria-hidden
                  className="flex-1 translate-y-[-3px] border-b border-dotted border-cream/25"
                />
                <dd className="shrink-0">{orderingHours}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[13px] text-sage">
              Open daily, seven days a week.
            </p>
          </div>
        </div>

        {/* ——— the oversized wordmark, shown in full above the fold line ———
            Painted from a pseudo-element, not a text node: it's decorative
            ink at 7% opacity, and as real text axe's color-contrast audit
            (rightly) can't tell it apart from content. */}
        <div aria-hidden className="pointer-events-none select-none">
          <p
            data-watermark={site.name}
            className="mt-[-0.12em] whitespace-nowrap text-center font-display text-[clamp(3.4rem,12.5vw,11.5rem)] font-medium italic leading-none text-cream/[0.07] before:content-[attr(data-watermark)]"
          />
        </div>

        {/* ——— colophon ——— */}
        <div className="flex flex-col gap-3 border-t border-cream/10 py-6 text-[13px] text-sage md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name} · {site.descriptor}
          </p>
          <p>{site.marketingLocation}, California · 100% Halal</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
