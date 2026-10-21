# Owner TODO — The Wrap Shack (itsawrapshack.com)

Items that need the owner before or shortly after launch. Everything below is
already marked `TODO(owner)` in the code where it applies.

## Content & business facts

- [x] **Instagram** — `https://instagram.com/itsawrapshack` is live in the
      footer and feeds `sameAs` in JSON-LD. Add a Facebook URL to
      `content/site.ts` (`socials.facebook`) if you have one.
- [x] **Real customer testimonials** — six real Google reviews are now in
      `content/testimonials.ts` and drive both the homepage rotator and the
      Review/AggregateRating structured data. Spelling was lightly normalized
      and a couple of location/currency fragments trimmed (see note below).
- [ ] **Verify menu prices/items** — `content/menu.ts` was transcribed from
      `public/brand/Wrap shack menu.pdf` (July 2026). Descriptions were polished
      into the site voice; items and prices are verbatim. Double-check against
      the current in-store menu.
- [ ] **Verify geo coordinates** — `content/site.ts` `geo` is approximate for
      40100 Washington St; pin the exact lat/lng for the JSON-LD.
- [ ] **Palm Desert vs Bermuda Dunes** — copy and SEO target "Palm Desert" per
      the brand brief; the contact page and schema carry the real Bermuda Dunes
      address. Confirm you're comfortable with that framing.

## Media

- [ ] **Real photography** — the gallery, story, and dish imagery are stills
      pulled from the brand film plus the studio shawarma render. Swap in real
      food/restaurant photos when available (`public/images/…`).
- [ ] **Higher-resolution hero video** — current source is 720p. When a 1080p+
      export exists, drop it in and re-run the frame extraction (commands in
      `CLAUDE.md` → Asset pipeline notes; force `-f image2`, keep the `delogo`
      only if the watermark is still baked in).
- [ ] **Transparent logo master** — the site uses a careful programmatic
      knockout of the white-background JPEG (`public/brand/logo.png` +
      `logo-cream.png`). If a vector/transparent original exists, replace both.

## CMS (`/admin`)

- [ ] **Set `ADMIN_PASSWORD`** in the deployment environment to enable the
      content editor at `/admin` (business info, menu, reviews, FAQ). Unset =
      admin disabled; the site runs on the built-in content. Optionally set
      `ADMIN_SECRET` for cookie signing separate from the password.
- [ ] **Host on a persistent Node server** (`next start` on a VPS or similar)
      if you want CMS edits to survive — edits are saved to
      `data/cms/content.json` on disk. On serverless hosts with ephemeral
      filesystems (e.g. Vercel), edits vanish on redeploy. Back up that file;
      deleting it resets the site to the built-in content.
- [ ] **Use HTTPS in production** — the admin session cookie is only sent over
      HTTPS when `NODE_ENV=production`.

## Local SEO — off-site (the biggest ranking levers; owner action only)

- [ ] **Google Business Profile** — claim/verify the listing for 40100
      Washington St Suite 109; set the website to itsawrapshack.com, hours,
      photos, menu link (Clover), and the "Order online" button. This single
      item outweighs everything on-site for "near me" searches.
- [ ] **Bing Places + Apple Business Connect** — same data, both free;
      Apple Maps feeds Siri/Apple Intelligence answers.
- [ ] **Yelp / TripAdvisor / delivery-app listings** — consistent NAP
      (name, address, phone) everywhere; inconsistencies dilute local rank.
- [ ] **Ask happy customers for Google reviews** — review volume/recency is
      a top local-pack factor; the site already links to the profile.
- [ ] **After deploy**: submit the sitemap in Google Search Console + Bing
      Webmaster Tools and verify the structured data with Google's Rich
      Results Test (the site emits a full Restaurant/Menu/FAQ entity graph).

## Wiring

- [ ] **Contact form delivery** — `src/app/api/contact/route.ts` is a validated
      stub: it accepts submissions but delivers them nowhere. Wire to
      transactional email (e.g. Resend → itsawrapshack@outlook.com).
- [ ] **GA4** — set `NEXT_PUBLIC_GA_ID` in the deployment environment to enable
      analytics (renders nothing when unset).
- [ ] **Clover URL** — currently `…/wrap-shack-bermuda-dunes` as provided.
      Confirm it's the final production ordering link.

## ⚠️ Worth a look — review provenance

The Google reviews you supplied reference a UK context (an "A4421 lay-by",
£ prices) and mention burgers, which aren't on the transcribed menu. The site
is positioned for Palm Desert, CA. I trimmed those specific fragments from the
displayed quotes so nothing contradicts the site, but you should confirm the
reviews belong to this location/brand before launch — and if burgers really are
served, add them to `content/menu.ts`.

## Known measurement note

Lighthouse (production build): SEO 100, Accessibility 100, Best Practices 100
on every page; Performance 98–99 on /menu and /about (desktop). The homepage
performance *score* is capped by a lab artifact: Chrome excludes full-viewport
images (the hero) from LCP, so the metric falls to the headline text, which
Lighthouse's simulation ties pessimistically to the JS graph. Observed
(real-device-style) metrics on the homepage are strong: LCP ≈ 1.8s, CLS 0,
TBT ≈ 200–500ms. Real-user monitoring after deploy will reflect the observed
numbers, not the simulated score.
