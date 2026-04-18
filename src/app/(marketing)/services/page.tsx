import type { Metadata } from "next";
import Link from "next/link";

import ServicesSection from "@/components/marketing/ServicesSection";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
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
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          One Dental Services
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Dental care designed for comfort and long-term oral health
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Browse our core services and book the treatment you need. Our team supports routine
          checkups, restorative care, cosmetic improvements, and urgent dental concerns.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
            href={MARKETING_ROUTES.BOOK_APPOINTMENT}
          >
            Book Appointment
          </Link>
          <Link
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            href={MARKETING_ROUTES.CONTACT}
          >
            Contact Us
          </Link>
        </div>
      </section>

      <ServicesSection />
    </main>
  );
}
