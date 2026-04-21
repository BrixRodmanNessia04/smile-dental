import type { Metadata } from "next";

import { toAbsoluteUrl } from "@/lib/seo/url";

const DEFAULT_OG_IMAGE_PATH = "/images/og-default.jpg";

export type OpenGraphInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
};

export function buildOpenGraph(input: OpenGraphInput): Metadata["openGraph"] {
  return {
    type: "website",
    url: toAbsoluteUrl(input.path),
    title: input.title,
    description: input.description,
    siteName: "One Dental Clinic",
    images: [
      {
        url: toAbsoluteUrl(input.imagePath ?? DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: input.title,
      },
    ],
  };
}

export function buildTwitterCard(input: OpenGraphInput): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [toAbsoluteUrl(input.imagePath ?? DEFAULT_OG_IMAGE_PATH)],
  };
}
