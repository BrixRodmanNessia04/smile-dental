import type { MetadataRoute } from "next";

import { buildMarketingSitemapEntries } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildMarketingSitemapEntries();
}
