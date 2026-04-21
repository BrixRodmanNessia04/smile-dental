import type { Metadata } from "next";

import { buildOpenGraph, buildTwitterCard } from "@/lib/seo/openGraph";
import { toAbsoluteUrl } from "@/lib/seo/url";

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
