"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  initGsap,
  prefersReducedMotion,
  EASE,
  type GsapBundle,
} from "@/lib/gsap";

/**
 * Cormorant italic editorial pull-line with a SplitText line reveal.
 * Lines rise from behind a masked edge — once, at 75% viewport.
 *
 * `immediate`: no reveal, paints with the page. REQUIRED when the line sits
 * above the fold — a hidden-until-GSAP pull-line up there becomes the page's
 * LCP element and records seconds late (GSAP loads at idle, off-boot-path).
 */
export default function PullLine({
  children,
  className = "",
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (immediate || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let split: InstanceType<GsapBundle["SplitText"]> | null = null;

    // wait for fonts so line breaks are measured against the real face
    // (and for gsap, which loads lazily off the boot path)
    let cancelled = false;
    Promise.all([initGsap(), document.fonts.ready]).then(
      ([{ gsap, SplitText }]) => {
        if (cancelled) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "pull-line",
          // default "auto" stamps aria-label on the <p>, which ARIA prohibits
          // on paragraph roles; the split text nodes stay readable as-is
          aria: "none",
        });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: EASE,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        });
      },
    );

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [immediate]);

  return (
    <p
      ref={ref}
      className={`font-display italic ${className}`}
      data-pullline={immediate ? undefined : ""}
    >
      {children}
    </p>
  );
}
