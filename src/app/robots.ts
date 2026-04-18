import type { MetadataRoute } from "next";

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return baseUrl && baseUrl.length > 0 ? baseUrl : "https://example.com";
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/patient"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
