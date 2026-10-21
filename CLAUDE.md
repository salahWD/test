# The Wrap Shack — itsawrapshack.com

Marketing site for **The Wrap Shack — Mediterranean Eats** (Lebanese/Mediterranean, 100% Halal, fast-casual). Premium editorial build; nothing may read as templated or AI-generated. Ordering is 100% delegated to Clover via external links.

## Brand facts (authoritative)

- Brand name in all UI/copy/metadata/schema: **"The Wrap Shack"**, descriptor "Mediterranean Eats". **Never** write "It's A Wrap Shack".
- Domain: `itsawrapshack.com` (intentionally differs from brand name — do not "fix").
- Marketing location: Palm Desert, Southern California. Real address (contact page + JSON-LD only): 40100 Washington St Suite 109, Bermuda Dunes, CA 92203.
- Phone (760) 360-8178 · mmalak@hotmail.com · Mon–Sun 11:00am–8:00pm · online ordering 11:30am–8:00pm.
- Clover: `https://www.clover.com/online-ordering/wrap-shack-bermuda-dunes` — single constant `CLOVER_ORDER_URL` in `content/site.ts`; every Order button consumes it (`target="_blank" rel="noopener"`).
- Never redesign the logo. `public/brand/logo.png` (transparent, original colors) and `logo-cream.png` (cream monochrome, for forest/dark surfaces) are the only logo assets.

## Design tokens (exact — CSS variables, mirrored in Tailwind theme)

```
--forest:      #1F3B2C   primary — deep Mediterranean forest green
--olive:       #75815B   sage-olive of the logo illustration
--sage:        #A8B396   soft supporting green
--cream:       #FAF6EE   page background — warm off-white
--garlic:      #F2EAD9   raised surfaces / cards
--tahini:      #D9C7A7   borders, subtle fills
--sand:        #C4A16B   kraft-paper warm sand
--gold:        #C9962E   accent — toasted gold, SPARINGLY (decorative/large/dark-surface only)
--gold-ink:    #8C6414   WCAG-passing gold for SMALL text + focus ring on cream/garlic
--charcoal:    #26241F   text — logo ink
--charcoal-60: rgba(38,36,31,0.68) secondary text (spec said 0.62; 0.68 passes AA on cream)
```

Contrast law: bright `--gold` is 2.5:1 on cream — never use it for text under 24px
or focus indicators on light surfaces; use `--gold-ink` there. Gold text on forest
(#1F3B2C) passes at any size.

Rules:
- Cream is the dominant field. Forest is for full-bleed "moment" chapters (story, final CTA) — the page alternates light/dark chapters.
- Gold ONLY on: primary CTA hover, small eyebrow labels, one hairline detail per section. Max ~3 gold instances per viewport.
- No pure `#FFF`, no pure `#000`, anywhere.
- Gradients: ≤3% luminance shifts or a warm hero vignette only. No gradient blobs, no glassmorphism, no neon.

## Typography

- Display/headings: **Cormorant Garamond** 500/600 + italic 500 (`next/font`, `display: swap`). Never positive letter-spacing on Cormorant; never weight ≥700.
- Body: **Montserrat** 400/500 — 17px/1.7, max-width 65ch. Nav/buttons/labels: Montserrat 600 uppercase, tracking 0.08em–0.12em.
- Hero display: `clamp(3.5rem, 8vw, 7.5rem)`, line-height 0.95, tracking -0.02em. Section headings: `clamp(2.25rem, 4vw, 3.75rem)`.
- Editorial device: large Cormorant italic pull-lines (story section) with GSAP SplitText line reveals.

## Motion language (site-wide law)

- Libraries: **GSAP (ScrollTrigger, SplitText) + Lenis only.** No Framer Motion, no AOS, no Three.js.
- Animate **only `transform` and `opacity`**.
- One easing family: `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP custom ease). Reveals 0.7–0.9s; micro-interactions 200–300ms.
- Reveal pattern: rise 24–32px + fade, stagger 60–90ms, trigger ~75% viewport, **once only**.
- Card images: 1.04→1.0 scale-settle on reveal; 1.0→1.03 on hover.
- Exactly ONE parallax outside the hero: story imagery at 0.9× scroll speed.
- Every animated element respects `prefers-reduced-motion: reduce` — no exceptions.
- `will-change` applied narrowly, removed after animation. No scroll listeners outside ScrollTrigger/Lenis.

## Hero (signature)

- Pinned scroll-scrubbed **canvas frame sequence** (never scrub `video.currentTime`, never plain `<video>`).
- Frames: `public/hero-frames/lg/f_001..146.webp` (landscape, 1280w) & `sm-v2/f_001..075.webp` (native-vertical, 720×1280). `sm` when `(max-width: 767px)` or `saveData`. The two sets are DIFFERENT films (see below), so their counts + finale timings differ — `SETS` in `HeroSequence.tsx` carries each; never assume they match. The mobile dir is VERSIONED (`sm-v2`) as a cache-buster: frames ship `Cache-Control: max-age=2592000, immutable`, so replacing the mobile film at the SAME path leaves phones serving the old cached frames for 30 days — always bump the dir suffix (`sm-v3`…) when re-extracting, never reuse the path.
- Poster: desktop `public/hero-frames/hero-poster.webp` (landscape frame 1); phones `hero-poster-sm.webp` (portrait frame 1 of the vertical film, art-directed via a `(max-width:767px)` `<source>`). Both `next/image` `priority` → the LCP; only the matched one downloads. Canvas fades in over it.
- Progressive preload: every 5th frame first, then backfill; `createImageBitmap` where supported. No loader UI.
- Pin ~300vh (150vh touch), `scrub: 0.5`, Lenis raf drives `ScrollTrigger.update`. Pin container is `h-dvh` (NOT `svh`) and `ScrollTrigger.config({ ignoreMobileResize: true })` — together they keep the hero filling the viewport when the mobile URL bar retracts (no white gap) without a pin-refresh jump. Never revert to `svh` here.
- Desktop film `public/brand/hero-source.mp4` (landscape): ingredients assemble into the wrap → dissolves into the REAL logo on white; scrub uses the FULL range, the film owns the logo finale, the vignette fades and header ink flips ~66% as the field turns light. Fallback: `scripts/hero-render.js`.
- Mobile film is a separate NATIVE-VERTICAL export (portrait): ingredients → kraft wrap + steam → dissolves to its OWN correctly-framed logo lockup on cream ~57%. Because the vertical film ends clean, there is NO cream/logo DOM overlay on mobile anymore (the old `endRef` hack for the cropped landscape finale is gone); the canvas owns the finale and header ink flips at ~57% (`creamAt`/`vignetteAt` are per-set in `HeroSequence.tsx`). Frames re-extracted with portable ffmpeg (`ffmpeg-static`, installed transiently — NOT a project dep) at every 4th source frame → 75 webp q74; poster at q80.
- Reduced motion: static hero (wrap still, not smoke frame 1), same overlay content, no pin.

## Signature details

- Faint paper-grain texture (~2–3% opacity, tiny repeating tile) on cream sections.
- Section dividers: thin hand-drawn irregular SVG line (1px, olive) — not `border-top`.
- Twine-knot SVG motif as story-section list bullet — used ONCE site-wide.
- Buttons: pill, forest fill, cream text, min 32px horizontal padding, Montserrat 600 13–14px uppercase. Hover: deeper green, gold 1px inner keyline fades in, arrow translates 4px. 250ms, brand ease.
- Focus states: gold 2px offset ring. Skip link present.

## Banned patterns

Shopping cart/checkout/reservations/accounts/DB · tilt-on-hover cards · magnetic buttons · custom cursors · preloaders/percentage counters · gradient blobs · glassmorphism · Google Maps JS SDK (static map image only) · raster stock dietary badges (use our line-icon SVG set) · copy clichés ("culinary journey", "explosion of flavors", "hidden gem") · keyword stuffing · re-animating reveals on scroll-up.

## Architecture

- Next.js (App Router, latest) · React 19 · TS strict · Tailwind v4 · GSAP + Lenis · Zod on the SERVER only (`/api/contact` + CMS schemas). The contact form is dependency-free (hand-rolled checks mirroring `lib/contact-schema.ts`) — its chunk is router-prefetched from every page, and RHF+zod there cost ~75 KB of "unused JS" site-wide. `browserslist` in package.json pins the Tailwind v4 browser floor (Chrome 111/Safari 16.4/Firefox 128) so SWC ships no legacy polyfills — never lower it without dropping Tailwind v4 first.
- Routes: `(site)/` group = `/`, `/menu`, `/catering`, `/about`, `/contact` (marketing chrome lives in `(site)/layout.tsx`); `/admin` = owner CMS with its own plain layout (noindex + robots-disallowed). Contact form posts to a route handler that is a clearly-marked TODO stub.
- All content in typed files under `content/` (site.ts, menu.ts, catering.ts, testimonials.ts, faq.ts). Components consume ONLY via `lib/content.ts` accessors — never import content files directly. Catering ordering is by PHONE, 48h ahead — no Clover buttons on `/catering`.
- Rendering: every public route is **statically prerendered** (build output must show `○` for all `(site)` pages + llms/sitemap/robots; only `/admin*`, `/api/contact`, `/uploads` are `ƒ`). CMS saves call `revalidatePath("/", "layout")` + `/llms.txt` = on-demand ISR — pages serve from the full-route cache (`x-nextjs-cache: HIT`) and refresh instantly after a save, no rebuild. Never add `cookies()`/`headers()`/`searchParams` to a `(site)` page. GET route handlers are NOT cached by default in Next 15+ — `llms.txt/route.ts` needs its `export const dynamic = "force-static"`.

## CMS (owner-only, custom)

- `content/*` files are the SEEDS. Owner edits live in SQLite at `data/cms/cms.db` (gitignored; better-sqlite3, one row per section, JSON text — see `src/lib/cms/db.ts`); present sections replace their seed wholesale, missing sections fall back. Zod schemas in `src/lib/cms/schema.ts` are the write/read contract. A legacy `content.json` overlay migrates automatically on first open (renamed `.migrated`).
- `src/lib/cms/store.ts#loadContent()` (server-only) merges stored sections over seeds, primes the accessor snapshot, and is called at the top of `(site)/layout.tsx` **and every page** (React-cached). Client components get the same bundle via `<ContentHydrator>` — accessors stay synchronous, no prop drilling. Never import `store.ts`/`db.ts`/`images.ts` from a client component.
- Auth: single `ADMIN_PASSWORD` env (+ optional `ADMIN_SECRET`), HMAC-signed expiry cookie, timing-safe compares (`src/lib/cms/auth.ts`). Unset password = admin disabled. This owner-only panel is the sanctioned exception to the "no accounts/DB" ban — the public site remains static, no visitor accounts.
- **`admin/layout.tsx` MUST keep `export const dynamic = "force-dynamic"`.** CI builds without `ADMIN_PASSWORD`, so `isAdmin()`'s `cmsEnabled()` early-return skips `cookies()` and Next silently prerenders every admin page (`○`) as a login redirect; on the VPS (password set) the first `revalidatePath("/","layout")` invalidates those entries and regeneration hits `cookies()` in a static context → `DYNAMIC_SERVER_USAGE`, `/admin` 500s permanently. Local builds mask this (dev `.env.local` has the password → `ƒ`). Check the CI build log's route table, not just a local build.
- Saves are server actions (`src/app/admin/actions.ts`): guard → Zod parse → transactional SQLite write → `revalidatePath("/", "layout")`. Edits are live without a rebuild, but REQUIRE a persistent Node server (`next start` on a VPS, single process) — ephemeral serverless filesystems lose edits on redeploy.
- Editable: business info (phone/email/hours/Clover URL/socials), home-page copy (hero eyebrow/headline/caption, mouneh corner intro+goods+tags+note, final-CTA lines — seeds in `content/home.ts`, section key `home`), menu (categories' labels+notes, items **incl. photos**), catering (sections' labels+notes, trays **incl. photos**, lead-time line), testimonials, FAQ. Category/section IDs are fixed (components reference them); SEO strings/address/brand facts are code-only on purpose. NOTE: the homepage hydrates `home` into ContentHydrator (HeroSequence is a client component reading it).
- Menu photos: `uploadMenuImage` server action → sharp re-encode (strip EXIF, ≤1600w, webp q82) → content-hashed key → Cloudflare R2 when the five `R2_*` env vars are set, else `data/uploads/` locally, served by the `/uploads/[...path]` route handler (NEVER write runtime files into `public/` — `next start` snapshots it at boot and new files 404 until restart). URL lands in `item.image` on save; an orphan sweep after each menu OR catering save deletes unreferenced uploads (15-min grace) — the referenced set spans BOTH sections (`sweepUploads` in actions.ts), since uploads are shared; never sweep against one section alone. Menu cards render `item.image` for ANY item — featured cards get the side-column layout, others a top banner. Catering trays also carry `image?` (seeds in `public/images/catering/` — generated set styled after the owner's real tray photos, July 2026); `/catering` rows render them as 4:3 thumbnails. `next.config.ts` builds `images.remotePatterns` from `R2_PUBLIC_URL` and raises the server-action body limit to 10 MB.

## CSS landmines (learned the hard way)

- Unlayered rules in globals.css BEAT Tailwind utilities (which live in `@layer`). `.grain` once had a `.grain > * { position: relative }` child rule that silently killed `fixed` positioning twice — grain now paints via `::before` at `z-index:-1` under `isolation: isolate`, and must never regain child rules.
- In flex/grid, `min-width: auto` stops shrinking: horizontal scrollers need `min-w-0` on the flex child, and long non-wrapping rows inside cards need `flex-wrap`.
- Menu data is the REAL menu transcribed from `public/brand/Wrap shack menu.pdf`.
- SEO: per-route Metadata API, JSON-LD (Restaurant, Menu/MenuItem, FAQPage, BreadcrumbList) sourced from `content/site.ts`, sitemap.ts, robots.ts, canonical `https://itsawrapshack.com`.
- Analytics: env-gated GA4 via `next/script` (`NEXT_PUBLIC_GA_ID`, renders nothing unset). Deploy-agnostic — no Vercel-only APIs.
- Performance: Lighthouse ≥95 ×4, mobile+desktop. GSAP/Lenis loaded only where used.

## Performance landmines (learned the hard way)

- **sharp version MUST stay inside Next's own range** (`^0.34.5`, matching `next/package.json` optionalDependencies). The project once had sharp 0.35 alongside Next's nested 0.34 → two libvips natives in one process → the image optimizer failed silently and served ORIGINALS (tell: `Content-Disposition: attachment`, byte-identical responses at every `w=`). Keep one deduped copy; after changing sharp, verify an optimizer URL returns `image/avif`.
- **GSAP is dynamically imported** — `initGsap()` (async) / `gsapNow()` (sync, for interaction handlers, may be null) in `lib/gsap.ts`. NEVER static-import "gsap" anywhere else: ~130 KB of eval on the boot path costs real mobile LCP/TBT.
- **Never entrance-animate the hero `<h1>`** (opacity OR transform): Chrome records an animated element's LCP at animation END, ≈ +1s LCP. The eyebrow/CTA carry the entrance; the headline stands.
- Hero frames preload only on FIRST interaction (scroll/wheel/touch/pointer/key) — the scrub is scroll-driven, so eager loading only starved the LCP (and every lab test) with ~2 MB.
- ScrollTrigger's pin gets a server-rendered `pinSpacer` div (HeroSequence) so hydration never reparents the hero (a reparent re-registers the headline as a late LCP candidate).
- Below-fold continuous animations (testimonials progress bar) must be IntersectionObserver-gated — a mounted GSAP tween burns main-thread frames even offscreen.
- **GSAP/Lenis load at FIRST INTERACTION, not at idle** (`afterFirstInteraction()` in `lib/gsap.ts` — wheel/touch/pointer/key/mousemove, deliberately NO `scroll`: Lighthouse/PSI dispatch a programmatic scroll mid-audit). Idle-loading put ~80 KB of parse inside every lab trace; interaction-gating keeps lab TBT clean and real users never notice (mousemove warms it instantly on desktop). Hero frame preload uses the same rule.
- **Nothing above the fold may be `[data-reveal]`/`[data-pullline]`-hidden** — reveals wait for GSAP, so an above-fold reveal becomes the page's LCP element recorded seconds late. Interior-page openers render static (or CSS `.hero-enter` on small side elements only); `<PullLine immediate>` exists for above-fold pull-lines. Same law as "never entrance-animate the hero h1".
- The `template.tsx` route fade runs ONLY on client-side navigations (module-level `hasNavigated` flag) — on initial load an opacity-0 page wrapper parks first paint behind hydration long-tasks (~+4 s mobile LCP on every route).
- **Hydration diet:** ContentHydrator ships ONLY what a page's client components actually read (layout: site+cloverUrl; home: +testimonials + just the menu items in `home-menu-ids.ts`; menu: nothing extra — MenuShell takes categories as a prop). Never the whole bundle: the full menu once rode along as ~15 KB of dead flight payload per page. Below-fold client sections are `next/dynamic` + `<Suspense>` (code-split, interruptible hydration). The `/menu` card list is SERVER-rendered (`MenuExplorer` server component + `MenuShell` client frame filtering via `data-dietary` attrs + GSAP Flip) — hydrating 55 cards cost ~500 ms mobile TBT.
- **`experimental.inlineCss` triples the stylesheet in every doc** (~60 KB raw each: the real `<style>` + two copies in the flight payload — document tree + router seed; framework-inherent, verified unfixable in userland). Accepted: it removes the only render-blocking request, gzip absorbs one copy, brotli (apex/Cloudflare) absorbs both. Never "fix" by stripping flight rows — hydration mismatch. Keep the stylesheet lean; every CSS byte ships ×3.
- Cormorant loads weight 500 only (600 is brand-permitted but unused); every dropped face is preload bytes racing the LCP.
- The Next image-optimizer cache (`.next/cache/images`) survives builds — after optimizer-related changes, clear it or stale (even broken-passthrough) responses persist.

## Asset pipeline notes

- Frame extraction used portable ffmpeg with `delogo=x=1124:y=568:w=72:h=64` (removes a baked-in watermark sparkle, bottom-right) — re-run on any new video export with `-f image2` forced (ffmpeg 8 otherwise writes a single animated webp).
- Logo knockout script: scratchpad `pdfwork/logo-knockout.js` (distance-from-white matte + unpremultiply).
- Site imagery (`public/images/`) is the owner-approved generated brand set (July 2026), styled after the real kitchen's food (pita + spring mix/red onion/tomato, sesame falafel, kraft + twine). `shawarma-cutout.webp` came from a flood-fill knockout (scratchpad `pdfwork/process-brand-images.js`, TOL 24). Real photography still welcome as it arrives.
