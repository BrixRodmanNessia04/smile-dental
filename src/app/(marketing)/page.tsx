import type { Metadata } from "next";

import AboutSection from "@/components/marketing/AboutSection";
import CTASection from "@/components/marketing/CTASection";
import HeroSection from "@/components/marketing/HeroSection";
import ServicesSection from "@/components/marketing/ServicesSection";
import UpdatesSection from "@/components/marketing/UpdatesSection";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "One Dental | Modern Patient-First Dental Care",
  description:
    "One Dental delivers modern, trustworthy dental care with easy online booking, patient updates, and personalized treatment.",
  path: "/",
  keywords: ["One Dental", "dental clinic", "book dentist", "patient-first care"],
});

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <UpdatesSection />
      <CTASection />
    </main>
  );
}
