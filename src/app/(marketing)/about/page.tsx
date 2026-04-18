import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Our Dental Clinic",
  description:
    "Learn about our dental team, patient-first approach, and commitment to safe, modern oral care.",
  path: "/about",
  keywords: ["about dental clinic", "dental team", "oral care providers"],
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">(marketing)/about/page.tsx</h1>
    </main>
  );
}
