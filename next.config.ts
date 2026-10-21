import type { NextConfig } from "next";

// When R2 is configured, menu photos are served from its public domain and
// next/image needs it allow-listed. Malformed URLs should fail the build
// loudly, not silently skip the pattern.
function r2RemotePatterns() {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) return {};
  let hostname: string;
  try {
    hostname = new URL(base).hostname;
  } catch {
    throw new Error(`R2_PUBLIC_URL is not a valid URL: ${base}`);
  }
  return {
    remotePatterns: [{ protocol: "https" as const, hostname, pathname: "/**" }],
  };
}

const nextConfig: NextConfig = {
  // Self-contained production bundle: the VPS receives only .next/standalone
  // (compiled server + traced node_modules) — no source code, no full deps.
  output: "standalone",
  // Pin tracing to this package so server.js always lands at
  // .next/standalone/server.js, even if a parent directory has a lockfile.
  outputFileTracingRoot: process.cwd(),
  // native module — must stay external to the server bundle
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // menu photo uploads arrive through a server action; the 1 MB default
    // would reject most phone photos
    serverActions: { bodySizeLimit: "10mb" },
    // The whole site shares one ~11 KB stylesheet — inlining it removes the
    // only render-blocking request (a full RTT off FCP/LCP on mobile). The
    // per-page HTML cost (~3 KB gzipped) is far cheaper than the round trip.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    // Five deliberate tiers: 75 = appetite/product photography (menu cards,
    // signature dishes — the selling surface); 70 = large image assets; 62 = standard menu items;
    // 60 = editorial/atmosphere photography (story, gallery, page heroes), where AVIF artifacts are
    // invisible at rendered sizes; 50 = flat brand art (logos).
    qualities: [50, 60, 62, 70, 75],
    // Optimizer responses default to max-age=60 — pointless revalidation
    // churn for sources that never change in place (public/ assets get new
    // filenames; CMS uploads are content-hashed). 30 days.
    minimumCacheTTL: 2592000,
    ...r2RemotePatterns(),
  },
};

export default nextConfig;
