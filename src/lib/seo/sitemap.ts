import type { MetadataRoute } from "next";

import { getSiteBaseUrl } from "@/lib/seo/url";

const PUBLIC_MARKETING_PATHS = [
  "/",
  "/about",
  "/services",
  "/updates",
  "/contact",
] as const;

export function buildMarketingSitemapEntries(
  now = new Date(),
): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();

  return PUBLIC_MARKETING_PATHS.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
