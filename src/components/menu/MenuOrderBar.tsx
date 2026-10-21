"use client";

import { useEffect, useRef, useState } from "react";
import { getCloverUrl } from "@/lib/content";
import OpenNow from "@/components/ui/OpenNow";

/**
 * Mobile-only sticky order bar for the menu page. Slides up once the page
 * intro scrolls away (IntersectionObserver on a sentinel rendered by the
 * page — no scroll listeners), so the Clover CTA is always one thumb away.
 */
export default function MenuOrderBar() {
  const cloverUrl = getCloverUrl();
  const [pastIntro, setPastIntro] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    const sentinel = document.querySelector("[data-orderbar-sentinel]");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => {
      // only ever after the sentinel has actually been observed off-screen
      if (entry.isIntersecting) {
        seen.current = true;
        setPastIntro(false);
      } else if (seen.current || entry.boundingClientRect.top < 0) {
        setPastIntro(true);
      }
    });
    io.observe(sentinel);

    // step aside once the footer arrives — never cover the fine print
    const footer = document.querySelector("footer");
    const ioFooter = footer
      ? new IntersectionObserver(([entry]) => setOverFooter(entry.isIntersecting))
      : null;
    if (footer && ioFooter) ioFooter.observe(footer);

    return () => {
      io.disconnect();
      ioFooter?.disconnect();
    };
  }, []);

  const shown = pastIntro && !overFooter;

  return (
    <div
      aria-hidden={!shown}
      className={[
        "fixed inset-x-0 bottom-0 z-40 border-t border-forest-deep bg-forest px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 ease-brand motion-reduce:transition-none md:hidden",
        shown ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {/* status chip yields entirely on very narrow screens — the CTA never crops */}
        <span className="hidden shrink-0 min-[375px]:block">
          <OpenNow compact className="text-sage" />
        </span>
        <a
          href={cloverUrl}
          target="_blank"
          rel="noopener"
          tabIndex={shown ? 0 : -1}
          className="group inline-flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-cream px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-forest outline-none transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
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
    </div>
  );
}
