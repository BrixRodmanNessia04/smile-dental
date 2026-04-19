import type { Metadata } from "next";

import CTASection from "@/components/marketing/CTASection";
import HeroSection from "@/components/marketing/HeroSection";
import ServicesSection from "@/components/marketing/ServicesSection";
import SplitFeatureSection from "@/components/marketing/SplitFeatureSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import Card, { CardContent } from "@/components/ui/card";
import { IMAGES } from "@/lib/constants/images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "One Dental | Exceptional Dental Care for Brighter Smiles",
  description:
    "Discover patient-first dental care at One Dental. Book appointments online, explore services, and enjoy a modern clinic experience.",
  path: "/",
  keywords: ["One Dental", "dental clinic", "book appointment", "dentist", "family dental care"],
});

const TRUST_PILLS = [
  "Comfort-first treatment approach",
  "Modern technology and sterilization standards",
  "Transparent treatment planning",
] as const;

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-14 overflow-x-clip px-4 py-8 md:space-y-16 md:px-6 md:py-10 lg:space-y-20 lg:px-8 lg:py-12">
      <HeroSection />

      <section className="-mt-8 grid grid-cols-1 gap-3 sm:-mt-10 md:grid-cols-2 lg:-mt-12 lg:grid-cols-3">
        {TRUST_PILLS.map((item) => (
          <Card className="h-full rounded-2xl border-border/80 bg-background/78 shadow-sm backdrop-blur-sm" key={item}>
            <CardContent className="flex min-h-[72px] items-center gap-3 p-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path d="m5 12 4 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <p className="text-sm font-medium leading-snug text-foreground">{item}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <ServicesSection
        description="Comprehensive care options for preventive, cosmetic, and restorative needs."
        limit={6}
        showBookCta
        showViewAll
        title="Our Services"
      />

      <SplitFeatureSection
        align="left"
        bullets={[
          "Comprehensive checkups and professional cleanings",
          "Personalized prevention plans for adults and kids",
          "Friendly guidance for better long-term oral health",
        ]}
        description="Preventive dentistry is the foundation of lasting oral health. We focus on early detection, patient education, and gentle care that keeps visits stress-free."
        eyebrow="Preventive care"
        imageAlt="Dentist consulting a patient during preventive care at One Dental"
        imageSrc={IMAGES.home.preventive}
        title="Protect your smile with proactive dental visits"
        visualLabel="Preventive Care Experience"
      />

      <SplitFeatureSection
        align="right"
        bullets={[
          "Comfortable treatment spaces and modern equipment",
          "Digital workflows for efficient appointments",
          "Clear communication at every stage of care",
        ]}
        description="From consultation to follow-up, One Dental combines modern technology with compassionate care so every patient feels informed and supported."
        eyebrow="Modern clinic"
        imageAlt="Modern dental equipment prepared for a comfortable patient appointment"
        imageSrc={IMAGES.home.technology}
        title="A premium dental experience designed around patient comfort"
        visualLabel="Modern Technology and Comfort"
      />

      <TestimonialsSection />

      <CTASection />
    </main>
  );
}
