"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMenu, formatPrice, type MenuItem } from "@/lib/content";
import { gsapNow, prefersReducedMotion, EASE } from "@/lib/gsap";
import DietaryBadge from "@/components/ui/DietaryBadge";
import Button from "@/components/ui/Button";
import type { SignatureId } from "@/components/home/home-menu-ids";

/**
 * Featured showcase: a large focus panel paired with a selectable rail.
 * Choosing a dish (hover / focus / tap / arrow keys / swipe) crossfades the
 * panel to it. Two dishes have no photograph, so they get an elegant
 * typographic-illustrative panel instead of a placeholder box.
 * Mobile-first: panel on top, full-width tappable rail below, swipe to change.
 */

type Motif = "falafel" | "salad";

interface Dish {
  // typed against home-menu-ids so a new dish id must be added there first
  // (that list drives what the home page hydrates for this section to read)
  itemId: SignatureId;
  title: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  motif?: Motif;
}

const DISHES: Dish[] = [
  {
    itemId: "chicken-shawarma-wrap",
    title: "Chicken Shawarma",
    blurb:
      "Off the spit, double-grilled, finished with the garlic sauce people drive across the valley for.",
    image: "/images/dishes/chicken-shawarma.webp",
    imageAlt:
      "Chicken shawarma wrap halves stacked on a plate, garlic sauce spilling from the cut",
  },
  {
    itemId: "gyro-wrap",
    title: "Beef Shawarma & Gyros",
    blurb:
      "Beef and lamb roasted vertical and shaved thin — tzatziki on the gyro, tahini on the beef.",
    image: "/images/dishes/beef-gyro.webp",
    imageAlt:
      "Gyro pita piled with shaved beef and lamb under a spoonful of tzatziki",
  },
  {
    itemId: "falafel-wrap",
    title: "Falafel",
    blurb:
      "Chickpeas and fava ground with herbs and sesame, fried to order. Crisp shell, green heart.",
    image: "/images/dishes/falafel.webp",
    imageAlt:
      "Sesame-crusted falafel on a plate, one broken open to its green herb interior",
  },
  {
    itemId: "tabouleh",
    title: "Tabbouleh Salad",
    blurb:
      "Parsley first, the way it should be — soaked bulgur, mint, tomato, and lemon under good olive oil.",
    image: "/images/menu/tabbouleh.webp",
    imageAlt:
      "Bowl of tabbouleh — chopped parsley and bulgur studded with tomato, a spoon resting in it",
  },
];

export default function SignatureDishes() {
  const menu = getMenu();
  const dishes = DISHES.map((d) => ({
    ...d,
    item: menu.find((m) => m.id === d.itemId)!,
  }));
  const count = dishes.length;

  const [active, setActive] = useState(0);
  const captionRef = useRef<HTMLDivElement>(null);
  const visualRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const didMount = useRef(false);
  const pointerX = useRef<number | null>(null);

  // The four panel photos are stacked (crossfade), so native lazy-loading
  // fetches all of them at boot — ~330 KB competing with the hero LCP from
  // 3000px below the fold. Mount them only once the section is near.
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // transition on change (skip the very first render — RevealManager owns entry)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (prefersReducedMotion()) return;
    // interaction-driven — gsap is idle-warmed well before the first tab tap
    const bundle = gsapNow();
    if (!bundle) return;
    const { gsap } = bundle;
    if (captionRef.current) {
      gsap.fromTo(
        captionRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE },
      );
    }
    const vis = visualRefs.current[active];
    if (vis)
      gsap.fromTo(
        vis,
        { scale: 1.05 },
        { scale: 1, duration: 0.9, ease: EASE },
      );
  }, [active]);

  const move = (dir: number) => {
    const next = (active + dir + count) % count;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onRailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    }
  };

  const activeDish = dishes[active];
  const priceItem: MenuItem = activeDish.item;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="dishes-heading"
      className="grain bg-cream"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-32">
        {/* header */}
        <div className="max-w-[60ch]">
          <p className="eyebrow text-gold-ink" data-reveal>
            Signature dishes
          </p>
          <h2
            id="dishes-heading"
            className="display-section mt-4 text-charcoal"
            data-reveal
          >
            What we&rsquo;re known for
          </h2>
          <p
            className="body-copy mt-5 text-[15.5px] leading-relaxed text-charcoal-60"
            data-reveal
          >
            Four things worth the trip. Pick one to take a closer look.
          </p>
        </div>

        <div className="mt-8 grid gap-8 md:mt-16 md:grid-cols-[1.4fr_1fr] md:items-stretch md:gap-14 lg:gap-20">
          {/* ——— FEATURED PANEL ——— */}
          <div data-reveal>
            <div
              role="tabpanel"
              id="dish-panel"
              aria-labelledby={`dish-tab-${active}`}
              className="relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[16px] border border-tahini bg-garlic md:aspect-[5/4]"
              onPointerDown={(e) => (pointerX.current = e.clientX)}
              onPointerUp={(e) => {
                if (pointerX.current === null) return;
                const dx = e.clientX - pointerX.current;
                if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
                pointerX.current = null;
              }}
            >
              {dishes.map((d, i) => (
                <div
                  key={d.itemId}
                  ref={(el) => {
                    visualRefs.current[i] = el;
                  }}
                  aria-hidden={i !== active}
                  className={[
                    "absolute inset-0 transition-opacity duration-700 ease-brand motion-reduce:transition-none",
                    i === active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  {d.image ? (
                    near && (
                      <Image
                        src={d.image}
                        alt={d.imageAlt ?? d.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover"
                      />
                    )
                  ) : (
                    <DishMotif kind={d.motif!} title={d.title} />
                  )}
                </div>
              ))}

              {/* index marker */}
              <span className="pointer-events-none absolute left-5 top-5 z-10 text-[12px] font-semibold tracking-[0.14em] text-gold-ink mix-blend-multiply">
                {String(active + 1).padStart(2, "0")}
                <span className="text-charcoal-60/60">
                  {" "}
                  / {String(count).padStart(2, "0")}
                </span>
              </span>
            </div>

            {/* caption */}
            <div ref={captionRef} aria-live="polite" className="mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-tight text-charcoal">
                  {activeDish.title}
                </h3>
                <span className="eyebrow text-charcoal-60">
                  from {formatPrice(priceItem)}
                </span>
              </div>
              <p className="body-copy mt-3 text-[15.5px] leading-relaxed text-charcoal-60">
                {activeDish.blurb}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="flex items-center gap-3">
                  {priceItem.dietary.map((k) => (
                    <DietaryBadge key={k} kind={k} withLabel />
                  ))}
                </span>
                <Link
                  href={`/menu#cat-${priceItem.category}`}
                  className="group ml-auto inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-forest underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold-ink"
                >
                  See it on the menu
                  <span
                    aria-hidden
                    className="transition-transform duration-250 ease-brand group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ——— RAIL ——— */}
          <div className="flex flex-col md:justify-between" data-reveal>
            <div
              role="tablist"
              aria-label="Signature dishes"
              aria-orientation="vertical"
              onKeyDown={onRailKeyDown}
              className="flex flex-col"
            >
              {dishes.map((d, i) => {
                const on = i === active;
                return (
                  <button
                    key={d.itemId}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`dish-tab-${i}`}
                    aria-selected={on}
                    aria-controls="dish-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={[
                      "group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-tahini/70 py-5 text-left transition-colors duration-300 ease-brand first:border-t md:py-6",
                      on ? "" : "hover:bg-garlic/50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "font-display text-[1.4rem] leading-none transition-colors duration-300",
                        on ? "text-gold-ink" : "text-tahini",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={[
                          "block font-display text-[1.5rem] font-medium leading-tight transition-colors duration-300 md:text-[1.7rem]",
                          on ? "text-charcoal" : "text-charcoal/70",
                        ].join(" ")}
                      >
                        {d.title}
                      </span>
                      {/* active-only teaser: price + dietary at a glance */}
                      <span
                        className={[
                          "flex items-center gap-3 overflow-hidden transition-all duration-400 ease-brand",
                          on
                            ? "mt-1.5 max-h-12 opacity-100"
                            : "max-h-0 opacity-0",
                        ].join(" ")}
                      >
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-charcoal-60">
                          from {formatPrice(d.item)}
                        </span>
                        {d.item.dietary.length > 0 && (
                          <span className="flex items-center gap-2">
                            {d.item.dietary.map((k) => (
                              <DietaryBadge key={k} kind={k} />
                            ))}
                          </span>
                        )}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={[
                        "text-forest transition-all duration-300 ease-brand",
                        on
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:opacity-60",
                      ].join(" ")}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>

            {/* section CTA — anchors the rail column beside the tall panel */}
            <div className="mt-9 md:mt-0 md:pt-10">
              <p className="body-copy mb-5 hidden text-[15px] leading-relaxed text-charcoal-60 md:block">
                Forty-plus dishes in all — mezza, plates from the grill, bowls,
                and sweets.
              </p>
              <Button href="/menu">See the full menu</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Elegant typographic-illustrative panel for dishes without a photograph:
 * paper-grain garlic field, a faint oversized Cormorant title, and an
 * olive line-art motif — never a gray placeholder box.
 */
function DishMotif({ kind, title }: { kind: Motif; title: string }) {
  return (
    <div className="grain relative flex h-full w-full items-center justify-center bg-garlic">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[clamp(3.5rem,12vw,7rem)] italic leading-none text-tahini/40"
      >
        {title}
      </span>
      <svg
        viewBox="0 0 120 100"
        className="relative h-[42%] w-auto text-olive"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* shared shallow bowl */}
        <path d="M22 54 Q60 96 98 54" />
        <path d="M18 54 H102" />
        {kind === "falafel" ? (
          <>
            <circle cx="44" cy="44" r="10" />
            <circle cx="62" cy="39" r="11" />
            <circle cx="79" cy="45" r="9" />
            <path d="M62 28 q4 -9 11 -8 M62 28 q-3 -8 -10 -7" />
          </>
        ) : (
          <>
            <path d="M60 46 C 48 30 40 30 34 40 C 44 48 54 48 60 46 Z" />
            <path d="M60 46 C 72 28 82 30 88 42 C 76 50 66 50 60 46 Z" />
            <path d="M60 46 C 58 32 60 26 66 20" />
            <path d="M60 46 V 30" />
          </>
        )}
      </svg>
    </div>
  );
}
