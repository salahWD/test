"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { getCloverUrl, getHome } from "@/lib/content";
import { initGsap, prefersReducedMotion, type GsapBundle } from "@/lib/gsap";

/**
 * The site's signature: a pinned, scroll-scrubbed canvas playback of the
 * hero frame sequence (never `<video>.currentTime` — h264 seeking is jumpy).
 *
 * - Poster (frame 1) renders via next/image `priority` → it is the LCP.
 * - Frames preload progressively on FIRST INTERACTION (the scrub is scroll-
 *   driven — before that they'd only starve the LCP): every 5th first, then
 *   backfill; createImageBitmap where supported. No loader UI — poster covers.
 * - `sm` set on small viewports / Save-Data. Pin: 300vh desktop, 150vh touch.
 * - Frames come from the owner-approved generated film (public/brand/
 *   hero-source.mp4): ingredients assemble into the wrap, which settles and
 *   dissolves into the REAL logo on white — the logo was image-conditioned,
 *   so the ending is faithful and the scrub uses the full range. The film
 *   owns the finale (no DOM logo overlay); the green vignette fades out and
 *   the header ink flips solid as the field turns light (~66%).
 * - prefers-reduced-motion: no pin, no scrub — a static wrap still (art-
 *   directed via <picture>) with the same overlay content.
 */

const SETS = {
  lg: { dir: "lg", end: 146, native: 146 },
  // dir is versioned (sm-v2) as a cache-buster: the frames carry a 30-day
  // immutable Cache-Control, so re-extracting the mobile film MUST land on a
  // fresh path or phones keep serving the old cached frames. Bump the suffix
  // whenever the sm film is replaced.
  sm: { dir: "sm-v2", end: 75, native: 75 },
} as const;

const HERO_ALT =
  "Shawarma ingredients assembling into a kraft-wrapped wrap over a deep green studio haze";

export default function HeroSequence() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const clover = getCloverUrl();
  const hero = getHome().hero;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const pinEl = pinRef.current;
    const canvas = canvasRef.current;
    if (!pinEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    const cfg = small || saveData ? SETS.sm : SETS.lg;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const pinVh = touch ? 150 : 300; // shorter scrub on touch — less scroll to clear the hero

    let disposed = false;
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(
      cfg.end,
    ).fill(null);
    const srcOf = (i: number) =>
      `/hero-frames/${cfg.dir}/f_${String(i + 1).padStart(3, "0")}.webp`;

    async function loadFrame(i: number): Promise<void> {
      if (frames[i] || disposed) return;
      try {
        if (typeof createImageBitmap === "function") {
          const blob = await (await fetch(srcOf(i))).blob();
          if (disposed) return;
          frames[i] = await createImageBitmap(blob);
        } else {
          frames[i] = await new Promise<HTMLImageElement>((res, rej) => {
            const img = new window.Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = srcOf(i);
          });
        }
      } catch {
        /* missing frame — nearest-neighbor draw covers it */
      }
    }

    /** Nearest loaded frame to `target` (scan outward — the set is small). */
    function nearestLoaded(target: number): number {
      if (frames[target]) return target;
      for (let d = 1; d < cfg.end; d++) {
        if (target - d >= 0 && frames[target - d]) return target - d;
        if (target + d < cfg.end && frames[target + d]) return target + d;
      }
      return -1;
    }

    let lastDrawn = -1;
    const state = { frame: 0 };

    function draw(target: number, force = false) {
      const idx = nearestLoaded(Math.max(0, Math.min(cfg.end - 1, target)));
      if (idx < 0 || (idx === lastDrawn && !force)) return;
      const img = frames[idx]!;
      lastDrawn = idx;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const iw = img.width;
      const ih = img.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = pinEl!;
      canvas!.width = Math.round(clientWidth * dpr);
      canvas!.height = Math.round(clientHeight * dpr);
      draw(Math.round(state.frame), true);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(pinEl);
    resize();

    // ——— progressive preload: every 5th frame, then backfill in batches ———
    // Deferred until the FIRST user interaction: the scrub is scroll-driven,
    // so frames are useless until the user moves — and ~2 MB of eager fetches
    // starves the font/LCP on slow connections (and every lab test). The
    // poster covers frame 1, and the coarse pass lands within the first
    // scroll gesture on any reasonable connection.
    // NO "scroll" here: Lighthouse/PSI dispatch a programmatic scroll during
    // gathering, which would pull ~2 MB of frames into every lab trace. Any
    // human scroll is preceded by wheel/touch/pointer/key anyway.
    const interactionEvents = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ] as const;
    let removeInteractionListeners = () => {};
    (async () => {
      await new Promise<void>((resolve) => {
        let done = false;
        const go = () => {
          if (done) return;
          done = true;
          removeInteractionListeners();
          resolve();
        };
        for (const ev of interactionEvents)
          window.addEventListener(ev, go, { once: true, passive: true });
        removeInteractionListeners = () => {
          for (const ev of interactionEvents)
            window.removeEventListener(ev, go);
        };
        // already mid-page (reload while scrolled) — warm immediately
        if (window.scrollY > 0) go();
      });
      if (disposed) return;
      const coarse: Promise<void>[] = [];
      for (let i = 0; i < cfg.end; i += 5) coarse.push(loadFrame(i));
      coarse.push(loadFrame(cfg.end - 1));
      await Promise.all(coarse);
      if (disposed) return;
      draw(Math.round(state.frame), true);
      setCanvasReady(true);
      for (let i = 0; i < cfg.end; i += 6) {
        if (disposed) return;
        await Promise.all(
          Array.from({ length: 6 }, (_, k) => i + k)
            .filter((j) => j < cfg.end)
            .map((j) => loadFrame(j)),
        );
      }
      if (!disposed) draw(Math.round(state.frame), true);
    })();

    // ——— the scrub timeline (gsap loads lazily — the pinned poster and CSS
    // entrance carry the hero until it lands, ~100 ms after idle) ———
    let tl: ReturnType<GsapBundle["gsap"]["timeline"]> | null = null;
    initGsap().then(({ gsap }) => {
      if (disposed) return;
      let creamPhase = false;
      // when the field turns light and the header's cream ink must flip dark:
      // the vertical mobile film dissolves to its cream logo field ~57%, the
      // landscape desktop film ~66%
      const creamAt = cfg === SETS.sm ? 0.57 : 0.68;
      // fade the green vignette out just before that dissolve so it never
      // tints the cream ending
      const vignetteAt = cfg === SETS.sm ? 0.5 : 0.6;
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: `+=${pinVh}%`,
          scrub: 0.5,
          pin: true,
          // our own server-rendered spacer: without it, ScrollTrigger wraps the
          // pinned element in a new div at hydration, and that DOM reparent
          // makes Chrome re-register the headline as a NEW (late) LCP candidate
          pinSpacer: spacerRef.current ?? undefined,
          anticipatePin: 1,
          onUpdate: (self) => {
            // once the field turns light, the transparent header's cream ink
            // would vanish — tell it to flip ink (the bar itself stays
            // transparent so it never crops the film's logo)
            const solid = self.progress > creamAt;
            if (solid !== creamPhase) {
              creamPhase = solid;
              window.dispatchEvent(
                new CustomEvent("hero:creamphase", { detail: { solid } }),
              );
            }
          },
          // pin released / re-entered — the header bar goes solid only once the
          // hero actually starts scrolling away (IO on the sentinel fires too
          // late: the sentinel sits in-viewport for the whole scroll-out)
          onLeave: () =>
            window.dispatchEvent(
              new CustomEvent("hero:released", { detail: { released: true } }),
            ),
          onEnterBack: () =>
            window.dispatchEvent(
              new CustomEvent("hero:released", { detail: { released: false } }),
            ),
        },
      });

      // full frame range across the scrub
      tl.to(
        state,
        {
          frame: cfg.end - 1,
          duration: 1,
          onUpdate: () => draw(Math.round(state.frame)),
        },
        0,
      );

      // 0–15%: intro overlay rises out; scroll cue gone by 5%
      if (cueRef.current)
        tl.to(cueRef.current, { opacity: 0, duration: 0.04 }, 0.01);
      if (introRef.current)
        tl.fromTo(
          introRef.current,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -48, duration: 0.09, immediateRender: false },
          0.055,
        );

      // ~45%: italic caption drifts through
      if (captionRef.current) {
        tl.fromTo(
          captionRef.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.06 },
          0.4,
        ).to(captionRef.current, { opacity: 0, y: -18, duration: 0.06 }, 0.53);
      }

      // the film dissolves to its light logo field — fade the green vignette
      // out so it doesn't tint the cream ending. Both the vertical mobile film
      // and the landscape desktop film now end on a complete, correctly-framed
      // logo lockup, so the canvas owns the finale (no DOM overlay).
      if (vignetteRef.current)
        tl.to(vignetteRef.current, { opacity: 0, duration: 0.1 }, vignetteAt);

      // (the intro entrance is a CSS animation — see .hero-enter — so the
      // headline paints before hydration and stays the fastest LCP candidate;
      // triggers created before this pin recalibrate on ScrollTrigger's own
      // window-load refresh)
    });

    return () => {
      disposed = true;
      removeInteractionListeners();
      ro.disconnect();
      tl?.scrollTrigger?.kill();
      tl?.kill();
      frames.forEach((f) => {
        if (f && "close" in f) (f as ImageBitmap).close();
      });
    };
  }, []);

  // Art-directed hero image: poster (frame 1) is the LCP; reduced-motion
  // users get the wrap still instead — single request either way.
  // q60: atmosphere shot behind a vignette, and the canvas covers it on the
  // first scroll — ~30% off the LCP image's bytes for invisible loss.
  const common = {
    alt: HERO_ALT,
    width: 1280,
    height: 720,
    sizes: "100vw",
    quality: 60,
  };
  const { props: staticProps } = getImageProps({
    ...common,
    src: "/images/hero-static.webp",
  });
  const { props: posterProps } = getImageProps({
    ...common,
    src: "/hero-frames/hero-poster.webp",
    priority: true,
  });
  // portrait LCP poster for phones — matches the vertical film's first frame
  // so the canvas fades in with no landscape→portrait poster swap
  const { props: posterSmProps } = getImageProps({
    ...common,
    width: 720,
    height: 1280,
    src: "/hero-frames/hero-poster-sm.webp",
    priority: true,
  });

  return (
    <section aria-label="Welcome to The Wrap Shack">
      {/* pre-rendered pin spacer — see pinSpacer above */}
      <div ref={spacerRef}>
        <div ref={pinRef} className="relative h-dvh overflow-hidden bg-forest">
          {/* LCP poster / reduced-motion still */}
          <picture>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet={staticProps.srcSet}
              sizes="100vw"
            />
            <source
              media="(max-width: 767px)"
              srcSet={posterSmProps.srcSet}
              sizes="100vw"
            />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes via posterProps */}
            <img
              {...posterProps}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>

          {/* the scrub canvas fades in over the poster once coarse frames exist */}
          <canvas
            ref={canvasRef}
            aria-hidden
            className={`absolute inset-0 h-dvh w-full transition-opacity duration-700 ${
              canvasReady ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* reduced-motion only: extra scrim so overlay text stays legible
            against the light wrap in the static still */}
          <div
            aria-hidden
            className="absolute inset-0 hidden motion-reduce:block"
            style={{
              background:
                "radial-gradient(90% 70% at 50% 55%, rgba(22,41,31,0.55) 0%, rgba(22,41,31,0.25) 60%, rgba(22,41,31,0.1) 100%)",
            }}
          />

          {/* warm vignette — the one permitted gradient; fades out for the
            film's light logo ending */}
          <div
            ref={vignetteRef}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 42%, rgba(196,161,107,0.10) 0%, rgba(22,41,31,0.18) 62%, rgba(22,41,31,0.42) 100%)",
            }}
          />

          {/* intro overlay — visible 0–15% of scrub */}
          <div
            ref={introRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="eyebrow hero-enter mb-6 text-tahini">
              {hero.eyebrow}
            </p>
            {/* deliberately NOT animated in: the headline is the LCP element,
                and Chrome records an entrance-animated element's paint only
                when the animation ENDS — a ~1s LCP penalty. The eyebrow and
                CTA rising around it carry the entrance choreography. */}
            <h1 className="display-hero text-cream">
              <span className="block">{hero.headlineTop}</span>
              <span className="block italic">{hero.headlineBottom}</span>
            </h1>
            <div
              className="hero-enter mt-10"
              style={{ animationDelay: "0.24s" }}
            >
              <a
                href={clover}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
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

          {/* mid-scrub caption (~45%) — hidden entirely under reduced motion */}
          <p
            ref={captionRef}
            aria-hidden
            className="absolute inset-x-0 top-[68%] z-10 px-6 text-center font-display text-[clamp(1.6rem,3vw,2.4rem)] italic text-cream opacity-0 motion-reduce:hidden"
          >
            {hero.caption}
          </p>

          {/* scroll cue — gone by 5% */}
          <div
            ref={cueRef}
            aria-hidden
            className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 motion-reduce:hidden"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/70">
              Scroll
            </span>
            <span className="block h-12 w-px bg-cream/50" />
          </div>
        </div>
      </div>

      {/* header watches this to flip from transparent to solid */}
      <div data-hero-sentinel aria-hidden className="h-px" />
    </section>
  );
}
