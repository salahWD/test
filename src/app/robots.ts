import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

/**
 * AI/answer-engine crawlers welcomed explicitly (AEO): a local restaurant
 * wants maximum surface in AI answers, so each major bot gets its own
 * allow rule rather than relying on the wildcard.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  const base = getSite().url;
  const disallow = ["/api/", "/admin"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
