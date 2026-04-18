import type { MetadataRoute } from "next";

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return baseUrl && baseUrl.length > 0 ? baseUrl : "https://example.com";
};

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
  const baseUrl = getBaseUrl();

  return PUBLIC_MARKETING_PATHS.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
