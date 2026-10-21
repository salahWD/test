import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;
  const lastModified = new Date(); // build/revalidation time
  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/menu`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/catering`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
