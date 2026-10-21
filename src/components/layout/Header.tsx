"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCloverUrl, getSite } from "@/lib/content";
import { gsapNow, prefersReducedMotion, EASE } from "@/lib/gsap";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Visit Us" },
] as const;

/**
 * Fixed header, three phases on the home hero:
 *  - "dark":  over the film's dark chapters — transparent bar, cream ink.
 *  - "light": the film's cream logo finale — STILL transparent (a solid bar
 *    would crop the film's logo), ink flips charcoal for contrast.
 *  - "solid": hero released — cream, blurred, hairline-bordered bar. Tracked
 *    via an IntersectionObserver on the hero's [data-hero-sentinel].
 *
 * The bar stays visible at all times while scrolling. The mobile menu is a
 * focus-trapped dialog that restores focus to its toggle on close.
 */
type HeaderPhase = "dark" | "light" | "solid";
export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const site = getSite();
  const cloverUrl = getCloverUrl();

  const [phase, setPhase] = useState<HeaderPhase>(isHome ? "dark" : "solid");
  const [menuOpen, setMenuOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  // Scroll-state: transparent over the hero (ink follows the film's field),
  // solid only after the hero releases.
  useEffect(() => {
    setMenuOpen(false);
    const sentinel = document.querySelector("[data-hero-sentinel]");
    if (!sentinel) {
      setPhase("solid");
      return;
    }
    setPhase("dark");
    // three signals: pin released or sentinel passed → solid bar; film in its
    // light end-phase while still pinned → bar stays transparent (a solid bar
    // would crop the film's logo), only the ink flips dark
    let pastHero = false;
    let released = false;
    let creamPhase = false;
    const update = () =>
      setPhase(pastHero || released ? "solid" : creamPhase ? "light" : "dark");
    const io = new IntersectionObserver(
      ([entry]) => {
        pastHero = entry.boundingClientRect.top <= 72;
        update();
      },
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(sentinel);
    const onCream = (e: Event) => {
      creamPhase = (e as CustomEvent<{ solid: boolean }>).detail.solid;
      update();
    };
    const onReleased = (e: Event) => {
      released = (e as CustomEvent<{ released: boolean }>).detail.released;
      update();
    };
    window.addEventListener("hero:creamphase", onCream);
    window.addEventListener("hero:released", onReleased);
    return () => {
      io.disconnect();
      window.removeEventListener("hero:creamphase", onCream);
      window.removeEventListener("hero:released", onReleased);
    };
  }, [pathname]);

  // Mobile overlay: scroll lock + staggered link reveal.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    // gsapNow(): loaded at idle long before anyone can tap the hamburger; on
    // the off chance it isn't, the overlay simply appears without the stagger
    const bundle = gsapNow();
    if (menuOpen && overlayRef.current && !prefersReducedMotion() && bundle) {
      const { gsap } = bundle;
      gsap.fromTo(
        overlayRef.current.querySelectorAll("[data-menu-item]"),
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE,
          stagger: 0.07,
          delay: 0.12,
        },
      );
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Dialog behavior: focus trap, Escape to close, restore focus on close.
  useEffect(() => {
    if (!menuOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusables = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ).filter((el) => el.tabIndex !== -1);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [menuOpen]);

  // bar chrome and ink color are independent: the film's cream finale keeps
  // the bar transparent (so the film's logo isn't cropped) with charcoal ink
  const transparent = phase !== "solid" && !menuOpen;
  const creamInk = phase === "dark" && !menuOpen;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-brand",
          transparent
            ? "bg-transparent"
            : "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_var(--color-tahini)]",
        ].join(" ")}
      >
        {/* reading-progress hairline — rides the solid bar's bottom edge */}
        {!transparent && (
          <span
            aria-hidden
            className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-olive/70"
          />
        )}
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Link
            href="/"
            aria-label="The Wrap Shack — home"
            className="shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          >
            {/* intrinsic size = rendered size (65×52 CSS px) and sizes="65px",
                so the optimizer serves the 96/128 buckets instead of 256;
                q50 — flat brand art, visually identical at a fraction of
                the bytes */}
            <Image
              src={creamInk ? "/brand/logo-cream.png" : "/brand/logo.png"}
              alt="The Wrap Shack — Mediterranean Eats"
              width={65}
              height={52}
              sizes="65px"
              quality={50}
              className="h-[52px] w-auto"
              priority
              fetchPriority="high"
            />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "eyebrow group relative py-2 outline-none transition-colors duration-250",
                        "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                        // active page reads as a highlight: full-strength ink +
                        // the held underline; inactive links sit slightly muted
                        creamInk
                          ? active
                            ? "text-cream"
                            : "text-cream/70 hover:text-cream"
                          : active
                            ? "text-forest"
                            : "text-charcoal-60 hover:text-forest",
                      ].join(" ")}
                    >
                      {item.label}
                      {/* underline grows from centre on hover; held for active */}
                      <span
                        aria-hidden
                        className={[
                          "absolute -bottom-0.5 left-0 h-px w-full origin-center transition-transform duration-300 ease-brand",
                          creamInk ? "bg-cream" : "bg-gold-ink",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100",
                        ].join(" ")}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={cloverUrl}
              target="_blank"
              rel="noopener"
              className={[
                "group hidden items-center gap-2.5 rounded-full px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] outline-none transition-[background-color,box-shadow,color] duration-250 ease-brand sm:inline-flex",
                "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
                creamInk
                  ? "bg-cream text-forest hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
                  : "bg-forest text-cream hover:bg-forest-deep hover:shadow-[inset_0_0_0_1px_var(--color-gold)]",
              ].join(" ")}
            >
              Order Now
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={[
                "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-sm outline-none md:hidden",
                "focus-visible:ring-2 focus-visible:ring-gold-ink focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                creamInk ? "text-cream" : "text-charcoal",
              ].join(" ")}
            >
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay — forest chapter, Cormorant links */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={[
          // z-[45]: above every page-level fixed bar (e.g. the menu page's z-40
          // order bar, which otherwise paints over this overlay), below the
          // z-50 header so the close button stays reachable.
          "fixed inset-0 z-[45] flex flex-col justify-center bg-forest px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[72px] transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} data-menu-item>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    className="group flex items-baseline gap-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
                  >
                    <span
                      aria-hidden
                      className="w-6 shrink-0 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage/70"
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={[
                        "relative font-display text-[2.75rem] font-medium leading-[1.15] transition-colors duration-250",
                        active
                          ? "text-gold"
                          : "text-cream group-hover:text-tahini",
                      ].join(" ")}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute -left-4 top-1/2 h-px w-2.5 -translate-y-1/2 bg-gold"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div data-menu-item className="mt-9">
            <a
              href={cloverUrl}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? 0 : -1}
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-forest outline-none transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
            >
              Order Now
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </nav>

        {/* footer rail — call + provenance */}
        <div className="absolute inset-x-8 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col gap-2">
          <a
            data-menu-item
            href={site.phoneHref}
            tabIndex={menuOpen ? 0 : -1}
            className="eyebrow inline-flex w-fit items-center gap-2 text-cream outline-none transition-colors duration-250 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-forest"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              aria-hidden
            >
              <path
                d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {site.phone}
          </a>
          <p data-menu-item className="eyebrow text-sage">
            Palm Desert · 100% Halal
          </p>
        </div>
      </div>
    </>
  );
}
