"use client";

import { useEffect, useRef, useState } from "react";
import type { Dietary } from "@/lib/content";
import { gsapNow, prefersReducedMotion, EASE } from "@/lib/gsap";
import { FilterPills } from "@/components/home/MenuPreview";

/**
 * The interactive frame around the server-rendered menu: sticky category
 * pills + dietary filters + desktop rail. The card list itself arrives as
 * `children` (server HTML, zero hydration cost — it's the page's heaviest
 * DOM by far); filtering toggles it imperatively via the cards' data
 * attributes, wrapped in the same GSAP Flip transition as before.
 */
export default function MenuShell({
  categories,
  children,
}: {
  categories: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ReadonlySet<Dietary>>(new Set());
  const [current, setCurrent] = useState(categories[0]?.id);

  const toggle = (k: Dietary) => {
    const next = new Set(active);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setActive(next);
    applyFilter(listRef.current, next);
  };

  // track which category heading is in view for the rail's active state
  useEffect(() => {
    const sections = document.querySelectorAll("[data-menu-category]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setCurrent((e.target as HTMLElement).dataset.menuCategory!);
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const jump = (id: string) => {
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      {/* filter pills — sticky below the header on all viewports */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-tahini bg-cream/95 px-5 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Menu categories"
            className="-mx-1 w-full min-w-0 overflow-x-auto scrollbar-none md:hidden"
          >
            <ul className="flex gap-1 whitespace-nowrap px-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jump(c.id)}
                    aria-current={current === c.id}
                    className={[
                      "rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-250",
                      current === c.id
                        ? "bg-forest text-cream"
                        : "text-charcoal-60 hover:text-forest",
                    ].join(" ")}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <FilterPills active={active} onToggle={toggle} />
          <p className="hidden text-[13px] text-charcoal-60 lg:block">
            Everything on this menu is 100% halal.
          </p>
        </div>
      </div>

      <div className="grid gap-8 pb-16 pt-8 md:grid-cols-[220px_1fr] md:gap-16 md:pb-28 md:pt-12">
        {/* desktop rail */}
        <nav aria-label="Menu categories" className="hidden md:block">
          <ul className="sticky top-[160px] space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => jump(c.id)}
                  aria-current={current === c.id}
                  className={[
                    "group flex w-full items-center gap-3 py-2 text-left text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors duration-250",
                    current === c.id
                      ? "text-forest"
                      : "text-charcoal-60 hover:text-forest",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "h-px bg-gold-ink transition-[width] duration-300 ease-brand",
                      current === c.id ? "w-6" : "w-0 group-hover:w-3",
                    ].join(" ")}
                  />
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* server-rendered item sections */}
        <div ref={listRef}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Imperative filter pass over the server-rendered cards, mirroring the
 * `matches` semantics MenuPreview uses (every active key must be present).
 * Wrapped in a GSAP Flip so the grid re-lays out smoothly; if GSAP hasn't
 * warmed yet (first-ever tap), the filter still applies — just unanimated.
 */
function applyFilter(list: HTMLElement | null, active: ReadonlySet<Dietary>) {
  if (!list) return;
  const items = Array.from(list.querySelectorAll<HTMLElement>("[data-item]"));
  const sections = Array.from(
    list.querySelectorAll<HTMLElement>("[data-menu-category]"),
  );

  const bundle = prefersReducedMotion() ? null : gsapNow();
  const flipState = bundle ? bundle.Flip.getState(items) : null;
  const prevHeight = bundle ? list.offsetHeight : null;

  for (const li of items) {
    const diets = (li.dataset.dietary ?? "").split(" ").filter(Boolean);
    const show = [...active].every((k) => diets.includes(k));
    li.classList.toggle("hidden", !show);
    li.setAttribute("aria-hidden", String(!show));
  }
  for (const sec of sections) {
    const any = sec.querySelector("[data-item]:not(.hidden)");
    sec.classList.toggle("hidden", !any);
  }

  if (!bundle || !flipState) return;
  const { gsap, Flip } = bundle;

  // absolute:true pulls cards out of flow mid-flip — pin the list's height
  // and tween it alongside so the content below doesn't yank up and back
  if (prevHeight !== null) {
    gsap.fromTo(
      list,
      { height: prevHeight },
      {
        height: list.offsetHeight,
        duration: 0.55,
        ease: EASE,
        onComplete: () => gsap.set(list, { clearProps: "height" }),
      },
    );
  }
  Flip.from(flipState, {
    duration: 0.55,
    ease: EASE,
    absolute: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.45, ease: EASE },
      ),
    onLeave: (els) =>
      gsap.to(els, { opacity: 0, scale: 0.98, duration: 0.3, ease: EASE }),
  });
}
