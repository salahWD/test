"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGsap, prefersReducedMotion, EASE } from "@/lib/gsap";

/**
 * The one reveal pattern (CLAUDE.md): rise 28px + fade, 0.85s, stagger 80ms,
 * triggered at 75% viewport, once only. Applies to every [data-reveal].
 * Under reduced motion the CSS never hides elements and this does nothing.
 * initGsap resolves at the first user interaction — reveals are scroll-born,
 * so nothing is lost, and no motion code runs in a boot/lab trace. Anything
 * [data-reveal] must therefore sit below the fold (above-fold copy renders
 * static or with the CSS .hero-enter entrance).
 */
export default function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;
    setup().then((result) => {
      if (cancelled) result?.();
      else cleanup = result;
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

async function setup(): Promise<(() => void) | null> {
  const { gsap, ScrollTrigger } = await initGsap();

  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  if (!els.length) return null;

  const batch = ScrollTrigger.batch(els, {
    start: "top 75%",
    once: true,
    onEnter: (targets) => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: EASE,
        stagger: 0.08,
        overwrite: true,
        onComplete: () => {
          targets.forEach((t) => {
            (t as HTMLElement).style.willChange = "auto";
          });
        },
      });
    },
  });

  // Images inside revealing cards get the slow 1.04 → 1.0 scale-settle.
  const imgTweens = gsap.utils
    .toArray<HTMLElement>("[data-reveal-img]")
    .map((img) =>
      gsap.fromTo(
        img,
        { scale: 1.04 },
        {
          scale: 1,
          duration: 1.2,
          ease: EASE,
          scrollTrigger: { trigger: img, start: "top 80%", once: true },
        },
      ),
    );

  return () => {
    batch.forEach((t) => t.kill());
    imgTweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
  };
}
