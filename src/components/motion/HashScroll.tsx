"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/lenis";
import { gsapNow } from "@/lib/gsap";

/**
 * Makes in-page anchors (e.g. /#mouneh) actually land: Lenis owns the
 * scroll position, so the browser's native hash jump gets overridden by its
 * next raf. This drives hash targets through Lenis instead — both after a
 * route change (menu → /#mouneh) and for same-page hash clicks (which fire
 * neither a navigation nor a hashchange under pushState). ScrollTrigger is
 * nudged when the ride ends, because a programmatic Lenis scroll emits no
 * user scroll event and the reveal batch would otherwise sit unfired.
 */

const HEADER_OFFSET = -80;

// our own in-flight flag: lenis.isScrolling is unreliable here (it reports
// truthy string states like "native" long after user scrolling has stopped,
// which silently vetoed every correction pass)
let riding = false;
let ridingTimeout: ReturnType<typeof setTimeout> | null = null;

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  const ScrollTrigger = gsapNow()?.ScrollTrigger;
  if (lenis) {
    // the hero pin-spacer can grow the page AFTER Lenis measured it — a
    // stale limit silently clamps long rides short of the target
    lenis.resize();
    riding = true;
    if (ridingTimeout) clearTimeout(ridingTimeout);
    // a user interrupting the ride cancels it without onComplete — release
    ridingTimeout = setTimeout(() => (riding = false), 2200);
    lenis.scrollTo(el, {
      offset: HEADER_OFFSET,
      onComplete: () => {
        riding = false;
        ScrollTrigger?.update();
      },
    });
  } else {
    el.scrollIntoView(); // reduced motion / pre-init: native jump
    ScrollTrigger?.update();
  }
}

/** Element already sitting at (or animating toward) its target position? */
function settled(hash: string): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = id ? document.getElementById(id) : null;
  if (!el) return true; // nothing to do
  if (riding) return true; // our ride in progress — don't restart it
  return Math.abs(el.getBoundingClientRect().top + HEADER_OFFSET) < 48;
}

export default function HashScroll() {
  const pathname = usePathname();

  // After any route change that carries a hash. Several passes, because the
  // target's position keeps moving under us: the router's scroll-reset can
  // land after the first ride, and arriving on the home page creates the
  // hero's ~300vh pin-spacer mid-ride, pushing everything below it down.
  // Each pass re-rides only if the target has drifted and no ride is active.
  useEffect(() => {
    if (!window.location.hash) return;
    const timers = [150, 900, 1900, 3100].map((delay) =>
      setTimeout(() => {
        const hash = window.location.hash;
        if (hash && !settled(hash)) scrollToHash(hash);
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  // same-page hash clicks — Next updates the URL but nothing re-renders
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const hashAt = href.indexOf("#");
      if (hashAt === -1) return;
      const path = href.slice(0, hashAt) || window.location.pathname;
      if (path !== window.location.pathname) return; // route change — effect above handles it
      const hash = href.slice(hashAt);
      // after Link's own handling, so Lenis gets the last word
      setTimeout(() => scrollToHash(hash), 60);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
