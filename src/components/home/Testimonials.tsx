"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTestimonials, getSite } from "@/lib/content";
import {
  initGsap,
  gsapNow,
  prefersReducedMotion,
  EASE,
  type GsapBundle,
} from "@/lib/gsap";

const INTERVAL = 7; // seconds per quote

function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span
      className={`inline-flex gap-1 text-gold-ink ${className}`}
      aria-hidden
    >
      {Array.from({ length: n }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-full w-auto"
          fill="currentColor"
        >
          <path d="M10 1.5l2.47 5.26 5.53.66-4.09 3.9 1.08 5.68L10 14.9l-4.99 2.5 1.08-5.68L2 7.42l5.53-.66L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Editorial review carousel: aggregate-rating header, a garlic quote card with
 * a decorative Cormorant quotation mark and GSAP drift-in transitions, arrow
 * controls, a synced auto-advance progress indicator, keyboard + swipe support.
 * Auto-advance pauses on hover/focus and never runs under reduced motion.
 */
export default function Testimonials() {
  const quotes = getTestimonials();
  const site = getSite();
  const count = quotes.length;
  const avg = (
    quotes.reduce((a, q) => a + (q.rating ?? 5), 0) / (count || 1)
  ).toFixed(1);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLQuoteElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
  const pointerX = useRef<number | null>(null);

  // the carousel sits below the fold — don't burn main-thread frames on the
  // progress tween until it's actually on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );
  const jump = useCallback((i: number) => setIndex(i), []);

  // drift-in of the newly active quote (opacity crossfade is CSS-driven)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = itemsRef.current[index];
    if (!el) return;
    const bundle = gsapNow();
    if (bundle)
      bundle.gsap.fromTo(el, { y: 26 }, { y: 0, duration: 0.8, ease: EASE });
  }, [index]);

  // auto-advance driven by the progress bar; pause halts the fill in place
  useEffect(() => {
    if (prefersReducedMotion() || count < 2 || !inView) return;
    const bar = fillRef.current;
    if (!bar) return;
    let tween: ReturnType<GsapBundle["gsap"]["fromTo"]> | null = null;
    let cancelled = false;
    initGsap().then(({ gsap }) => {
      if (cancelled) return;
      tween = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: INTERVAL,
          ease: "none",
          transformOrigin: "left center",
          onComplete: () => go(1),
        },
      );
      if (paused) tween.pause();
    });
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [index, paused, count, go, inView]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  };

  return (
    <section
      ref={rootRef}
      aria-label="Customer reviews"
      className="grain bg-cream"
    >
      <div
        className="mx-auto max-w-[1000px] px-5 py-16 md:py-32"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onKeyDown={onKeyDown}
      >
        {/* aggregate credibility header */}
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow text-gold-ink" data-reveal>
            From the counter
          </p>
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            data-reveal
          >
            <Stars className="h-4" />
            <span className="font-display text-[1.9rem] font-medium leading-none text-charcoal">
              {avg}
            </span>
            <span className="h-4 w-px bg-tahini" aria-hidden />
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener"
              className="eyebrow text-charcoal-60 underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:text-forest hover:decoration-gold-ink"
            >
              {count} five-star reviews on Google ↗
            </a>
          </div>
        </div>

        {/* quote card */}
        <div className="relative mt-10 md:mt-14" data-reveal>
          <div
            className="relative overflow-hidden border border-tahini bg-garlic px-6 pb-10 pt-14 md:px-20 md:pb-16 md:pt-20"
            onPointerDown={(e) => (pointerX.current = e.clientX)}
            onPointerUp={(e) => {
              if (pointerX.current === null) return;
              const dx = e.clientX - pointerX.current;
              if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
              pointerX.current = null;
            }}
          >
            {/* the section's one gold hairline detail */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-px w-16 bg-gold-ink md:w-24"
            />

            {/* decorative Cormorant quotation watermark */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2 left-3 select-none font-display text-[9rem] leading-none text-sand/25 md:left-8 md:text-[13rem]"
            >
              &ldquo;
            </span>

            <div className="relative z-10 min-h-[390px] sm:min-h-[250px] md:min-h-[320px]">
              {quotes.map((q, i) => (
                <blockquote
                  key={q.id}
                  ref={(el) => {
                    itemsRef.current[i] = el;
                  }}
                  aria-hidden={i !== index}
                  className={[
                    "absolute inset-0 flex flex-col overflow-y-auto transition-opacity duration-700 ease-brand motion-reduce:transition-none",
                    i === index
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  ].join(" ")}
                >
                  <p className="font-display text-[clamp(1.4rem,2.6vw,2.15rem)] font-medium italic leading-[1.45] text-charcoal">
                    {q.quote}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-8">
                    <Stars className="h-3.5" n={q.rating ?? 5} />
                    <span className="eyebrow text-charcoal">
                      {q.attribution}
                    </span>
                    {q.source && (
                      <span className="eyebrow text-charcoal-60/70">
                        {q.source}
                      </span>
                    )}
                    {q.date && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-tahini" aria-hidden />
                        <span className="eyebrow text-charcoal-60/70">
                          {q.date}
                        </span>
                      </>
                    )}
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        </div>

        {/* controls: arrows + progress track */}
        <div
          className="mt-7 flex items-center md:mt-9 justify-center gap-6"
          data-reveal
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous review"
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest shadow-[inset_0_0_0_1px_var(--color-tahini)] transition-[background-color,box-shadow] duration-250 ease-brand hover:shadow-[inset_0_0_0_1px_var(--color-olive)] hover:bg-garlic"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label="Choose a review"
          >
            {quotes.map((q, i) =>
              i === index ? (
                <span
                  key={q.id}
                  className="relative h-[6px] w-10 overflow-hidden rounded-full bg-tahini"
                  role="tab"
                  aria-selected
                >
                  <span
                    ref={fillRef}
                    className="absolute inset-0 origin-left rounded-full bg-forest motion-reduce:scale-x-100"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              ) : (
                <button
                  key={q.id}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-label={`Show review ${i + 1}`}
                  onClick={() => jump(i)}
                  className="h-[6px] w-[6px] rounded-full bg-tahini transition-[background-color,transform] duration-250 ease-brand hover:scale-125 hover:bg-sand"
                />
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next review"
            className="flex h-11 w-11 items-center justify-center rounded-full text-forest shadow-[inset_0_0_0_1px_var(--color-tahini)] transition-[background-color,box-shadow] duration-250 ease-brand hover:shadow-[inset_0_0_0_1px_var(--color-olive)] hover:bg-garlic"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              aria-hidden
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
