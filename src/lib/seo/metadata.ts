import type { Metadata } from "next";

import { buildOpenGraph, buildTwitterCard } from "@/lib/seo/openGraph";

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return baseUrl && baseUrl.length > 0 ? baseUrl : "https://example.com";
};

const toAbsoluteUrl = (path: string) => new URL(path, getBaseUrl()).toString();

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
};

export function buildPageMetadata(input: PageSeoInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: toAbsoluteUrl(input.path),
    },
    openGraph: buildOpenGraph({
      title: input.title,
      description: input.description,
      path: input.path,
      imagePath: input.imagePath,
    }),
    twitter: buildTwitterCard({
      title: input.title,
      description: input.description,
      path: input.path,
      imagePath: input.imagePath,
    }),
  };
}

export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1).toLowerCase()}`)
    .join(" ");
}
