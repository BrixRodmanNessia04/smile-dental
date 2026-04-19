import type { Metadata } from "next";

import CTASection from "@/components/marketing/CTASection";
import ServicesSection from "@/components/marketing/ServicesSection";
import SplitFeatureSection from "@/components/marketing/SplitFeatureSection";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "One Dental Services",
  description:
    "Explore One Dental's full service catalog for preventive, cosmetic, and restorative dental care.",
  path: "/services",
  keywords: ["One Dental services", "preventive care", "cosmetic dentistry", "restorative care"],
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">One Dental services</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          Comprehensive dental care tailored to your needs
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Explore our curated MVP service lineup for preventive, cosmetic, and restorative dental
          care, aligned with the same options shown during online booking.
        </p>
      </section>

      <ServicesSection
        description="Browse our full list of services and choose the treatment that fits your smile goals."
        limit={24}
        showBookCta
        showViewAll={false}
        title="All Services"
      />

      <SplitFeatureSection
        align="right"
        bullets={[
          "Care plans based on your oral health goals",
          "Flexible scheduling with guided online booking",
          "Supportive team for follow-up and aftercare",
        ]}
        description="Need help choosing the right treatment? Our team can guide you through options based on your concerns, lifestyle, and timeline."
        eyebrow="Need guidance?"
        title="We help you choose the right treatment path"
        visualLabel="Service Planning Support"
      />

      <CTASection />
    </main>
  );
}
