import type { Metadata } from "next";

import { CardContent, Card } from "@/components/ui/card";
import CTASection from "@/components/marketing/CTASection";
import HeroSection from "@/components/marketing/HeroSection";
import ServicesSection from "@/components/marketing/ServicesSection";
import SplitFeatureSection from "@/components/marketing/SplitFeatureSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
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

  const MAP_EMBED_URL = "https://www.google.com/maps?q=123+One+Dental+Avenue,+Dental+City&z=15&output=embed";
  const MAPS_OPEN_URL = "https://maps.google.com/?q=123+One+Dental+Avenue,+Dental+City";


  return (
    <main className="marketing-page mx-auto w-full max-w-[90rem] space-y-14 overflow-x-clip px-4 py-8 md:space-y-16 md:px-6 md:py-10 lg:space-y-20 lg:px-8 lg:py-12">
      <HeroSection />

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRUST_PILLS.map((item) => (
          <div
            className="marketing-card-hover flex min-h-[84px] items-center gap-4 rounded-2xl border border-border/70 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            key={item}
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m5 12 4 4L19 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>

            <p className="text-base font-semibold leading-snug text-foreground">
              {item}
            </p>
          </div>
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
        learnMoreSlug="preventive-care"
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
        learnMoreSlug="modern-dental-clinic"
        title="A premium dental experience designed around patient comfort"
        visualLabel="Modern Technology and Comfort"
      />

      <TestimonialsSection />

      <CTASection />

       <Card className="overflow-hidden rounded-3xl border border-border/70 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          <CardContent className="p-4 pt-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  Find us
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  View the clinic location, plan your route, and check the area before your visit.
                </p>
              </div>

              <a
                href={MAPS_OPEN_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                Open in Maps
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-secondary/20">
              <iframe
                className="aspect-[16/10] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={MAP_EMBED_URL}
                title="One Dental location map"
              />
            </div>

            <div className="mt-4 rounded-2xl bg-muted/50 px-4 py-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                For exact parking and entrance instructions, call the clinic before your visit.
              </p>
            </div>
          </CardContent>
        </Card>
    </main>
  );
}
