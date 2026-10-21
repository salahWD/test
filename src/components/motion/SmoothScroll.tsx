"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import {
  initGsap,
  gsapNow,
  prefersReducedMotion,
  afterFirstInteraction,
} from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Site-wide Lenis smooth scrolling, driving GSAP ScrollTrigger from its raf.
 * Skipped entirely under prefers-reduced-motion. Both libraries load at the
 * FIRST user interaction (initGsap self-gates; lenis rides the same gate) —
 * native scroll covers the handful of frames before they land, and nothing
 * motion-related ever sits on the boot path.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([
        initGsap(),
        afterFirstInteraction().then(() => import("lenis")),
      ]);
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    })();

    return () => {
      cancelled = true;
      if (raf) gsapNow()?.gsap.ticker.remove(raf);
      setLenis(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
