"use client";

import { getLenis } from "@/lib/lenis";

/** Footer back-to-top — rides Lenis when it's running, native scroll otherwise. */
export default function BackToTop() {
  const toTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex items-center gap-2 self-start text-[13px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors duration-250 ease-brand hover:text-cream"
    >
      Back to top
      <span
        aria-hidden
        className="inline-block transition-transform duration-250 ease-brand group-hover:-translate-y-0.5"
      >
        ↑
      </span>
    </button>
  );
}
