import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Our Dental Clinic",
  description:
    "Get in touch with our clinic for appointment scheduling, service inquiries, and patient support.",
  path: "/contact",
  keywords: ["contact dentist", "book dental appointment", "dental clinic phone"],
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">(marketing)/contact/page.tsx</h1>
    </main>
  );
}
