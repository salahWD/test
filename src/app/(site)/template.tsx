"use client";

import { useEffect } from "react";

/**
 * Remounts on every route change, giving each page a quiet enter fade.
 * Opacity only — a transform here would become a containing block for the
 * hero's ScrollTrigger pin (position: fixed) and break the scrub.
 *
 * The fade runs ONLY on client-side navigations. On the initial load the
 * wrapper must render visible: starting the whole page at opacity 0 parks
 * its first paint behind hydration's long tasks on a throttled CPU, which
 * pushes every route's LCP out by seconds — the "never entrance-animate
 * the hero <h1>" landmine, one ancestor up.
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
