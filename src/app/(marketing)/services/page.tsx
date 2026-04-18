import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Dental Services",
  description:
    "Explore our preventive, restorative, cosmetic, and emergency dental services tailored for every patient.",
  path: "/services",
  keywords: ["dental services", "preventive dentistry", "cosmetic dentistry"],
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">(marketing)/services/page.tsx</h1>
    </main>
  );
}
