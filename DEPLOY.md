# Deployment — The Wrap Shack (Next.js → shared VPS)

**Architecture:** GitHub Actions builds on its own runners (the shared VPS does
**no** npm/build work), produces a Next.js **standalone** bundle, `rsync`s only
that bundle over SSH, and hot-reloads it under **PM2**. **Nginx** reverse-proxies
the public domain to the app's private port; **Certbot** provides HTTPS. Push to
`main` → it deploys itself. No source code, git repo, or full `node_modules`
ever lands on the server.

```
GitHub push ──▶ Actions: npm ci + next build (standalone) ──▶ rsync bundle ──▶ VPS
                                                                                │
        Nginx (:443, itsawrapshack.coredex.solutions) ──▶ 127.0.0.1:3060 ──────┘ (PM2)
```

**Locked values** (from live recon of `72.61.102.180`, July 2026):

| Thing | Value |
|---|---|
| Domain (temporary) | `itsawrapshack.coredex.solutions` — apex switch procedure in §6 |
| VPS host / SSH port / user | `72.61.102.180` / `22` / `root` |
| Deploy path | `/var/www/itsawrapshack` |
| App port (free at recon) | `3060` (3000/3001/3005/3010/3011/3015/3020/3030/3040/3050/3100 taken) |
| PM2 process name | `itsawrapshack` — fork mode, **1 instance, never cluster** (single-writer SQLite) |
| Node major | `20` (server runs v20.20.1 — CI builds on 20 so native-module ABIs match) |
| CI runner | `ubuntu-22.04` pinned (glibc parity with the VPS) |

## 1. GitHub → Settings → Secrets and variables → Actions

**Secrets** (encrypted): `DEPLOY_SSH_KEY` (private key whose public half is in
root's `authorized_keys` — the shared `github-actions-deploy` key), `VPS_HOST`,
`VPS_PORT`, `VPS_USER`, `DEPLOY_PATH`.

**Variables** (plain): `APP_NAME=itsawrapshack`, `APP_PORT=3060`,
`NODE_VERSION=20`, `SITE_URL`, `R2_PUBLIC_URL`, optionally `NEXT_PUBLIC_GA_ID`.

⚠️ `R2_PUBLIC_URL` is **dual-homed**: the Actions variable is baked into
`images.remotePatterns` at build time, and the VPS `.env.local` value is used at
runtime for upload URLs. They MUST be identical, or R2-hosted menu photos 400
through `next/image`.

## 2. Persistent state on the VPS (survives every deploy)

The rsync uses `--delete` but excludes exactly these — everything else in the
deploy path is replaceable build output:

- `/var/www/itsawrapshack/.env.local` — runtime secrets, mode 600, **LF
  endings, dotenv format** (the standalone server parses it itself at boot;
  it is never shell-sourced). Keys: `ADMIN_PASSWORD`, `ADMIN_SECRET`, the five
  `R2_*` (note: `R2_BUCKET`, not `R2_BUCKET_NAME`), `SMTP_HOST/PORT/USER/PASS`,
  `CONTACT_EMAIL`, `REVALIDATE_TOKEN`.
- `/var/www/itsawrapshack/data/` — the CMS SQLite database (`data/cms/cms.db`)
  and local-fallback uploads (`data/uploads/`).
- `.next/cache/` — image-optimizer cache; kept warm so deploys don't trigger a
  sharp CPU burst on the shared box.

Backups: `/etc/cron.d/itsawrapshack-backup` snapshots `cms.db` nightly via
`sqlite3 .backup` (WAL-safe) into `/var/backups/itsawrapshack/`, pruning after
14 days.

## 3. Why the post-deploy revalidate step exists

CI builds against an **empty** CMS database, so the prerendered HTML in every
bundle is seed content. The workflow's last step POSTs to
`http://127.0.0.1:3060/api/revalidate` (Bearer `REVALIDATE_TOKEN`, read from the
server's `.env.local`) after the PM2 reload, which re-renders every route from
the live database immediately. Without it, real CMS content would reappear only
on the next admin save or the hourly ISR pass.

## 4. Nginx

`/etc/nginx/sites-available/itsawrapshack.conf` — no `default_server` (the
box's `000-catchall.conf` owns that). `client_max_body_size 12m` at server
level is **required**: the CMS photo upload is a 10 MB server action and
nginx's 1 MB default would 413 it. While on the temporary subdomain the block
sends `X-Robots-Tag: noindex, nofollow` (the site's canonical URLs point at
itsawrapshack.com) — **remove that header at the apex switch**.

Delivery details the setup workflow also owns (re-run it to reapply):

- **HTTP/2** is appended to certbot's TLS `listen` lines post-issuance
  (nginx 1.18 has no `http2 on;` directive). The sed is idempotent.
- **Static is served from disk, not proxied** (the dr-bilal pattern,
  completed): `/_next/static/` aliases the deploy dir with
  `Cache-Control: immutable` and serves the **CI-precompressed** `.br`
  (brotli -q11) / `.gz` (zopfli) siblings via `brotli_static`/`gzip_static` —
  the VPS never spends CPU compressing hashed assets. `/hero-frames/`,
  `/images/`, `/brand/`, `/og.jpg` come from `public/` on disk with a 30-day
  Cache-Control. These URLs are immutable-by-name: **replacing a public asset
  requires a new filename**, or returning visitors see the old one for up to
  30 days.
- **Brotli**: the provisioning script loads nginx's brotli modules when the
  OS provides them (falls back to gzip cleanly via empty include-snippets —
  the site config is identical either way). With brotli active, nginx strips
  `Accept-Encoding` toward Node so HTML/JSON get brotli (or gzip) chosen
  per-client at the edge; without it, Node's own gzip serves HTML as before.
  Compression directives are scoped to this server block — other sites on
  the box are untouched.
- Node keeps only what must be dynamic: HTML/ISR, `/api/*`, `/uploads/*`,
  and the image optimizer (AVIF, 30-day `minimumCacheTTL`; its disk cache
  survives deploys via the rsync `.next/cache/` exclude).
- The deploy bundle **prunes `public/brand/` to the two logo files** — the raw
  film masters / menu PDF / reference photos in that folder never ship.

## 5. Updating the site

Just push to `main` (or run the workflow manually — it has
`workflow_dispatch`). Roll back by re-running an older green workflow run.
Owner CMS edits need no deploy at all: they write to SQLite on the box and
revalidate in place.

## 6. Switching to itsawrapshack.com later

1. DNS: A records for `@` and `www` → `72.61.102.180` (site's canonical domain).
2. On the VPS: add `itsawrapshack.com www.itsawrapshack.com` to `server_name`,
   **delete the `X-Robots-Tag` noindex header**, `nginx -t && systemctl reload nginx`.
3. `certbot --nginx -d itsawrapshack.com -d www.itsawrapshack.com --redirect`.
4. GitHub variable `SITE_URL=https://itsawrapshack.com`.
5. Optionally keep the subdomain server block as a 301 to the apex.
