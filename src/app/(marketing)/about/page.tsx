import type { Metadata } from "next";

import CTASection from "@/components/marketing/CTASection";
import SplitFeatureSection from "@/components/marketing/SplitFeatureSection";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About One Dental",
  description:
    "Learn about One Dental's mission, values, and patient-first approach to modern family dentistry.",
  path: "/about",
  keywords: ["One Dental", "about dental clinic", "dental mission", "patient-first dentistry"],
});

const VALUES = [
  {
    title: "Compassionate care",
    description: "We listen first, then design treatment around your comfort and priorities.",
  },
  {
    title: "Clinical excellence",
    description: "Our team follows modern standards to deliver safe, high-quality dentistry.",
  },
  {
    title: "Clear communication",
    description: "You get transparent options, costs, and next steps at every visit.",
  },
] as const;

const TEAM = [
  { name: "Dr. Maria Santos", role: "Lead Dentist" },
  { name: "Dr. Ethan Reyes", role: "Restorative Dentistry" },
  { name: "Dr. Claire Tan", role: "Family and Preventive Care" },
] as const;

const MESSENGER_URL = "https://m.me/page-username";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">About One Dental</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          A dental clinic built on trust, comfort, and modern care
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          One Dental provides premium, patient-focused dentistry for individuals and families. Our
          mission is to make every visit clear, supportive, and confidence-building.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">Our mission and values</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              We combine compassionate service with modern dentistry so patients receive long-term
              oral health support in a welcoming environment.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {VALUES.map((value) => (
                <article className="rounded-xl border border-border bg-card-strong p-4" key={value.title}>
                  <h3 className="text-sm font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5">
          <CardContent className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Need quick assistance?</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">Chat with us on Messenger</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask about appointments, directions, or available services and our team will respond
              as soon as possible during clinic hours.
            </p>
            <div className="mt-5">
              <Button asChild className="w-full" size="lg" variant="accent">
                <a href={MESSENGER_URL} rel="noreferrer" target="_blank">
                  Chat with us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <SplitFeatureSection
        align="left"
        bullets={[
          "Personalized consultations and treatment planning",
          "Family-friendly scheduling and communication",
          "Ongoing prevention and follow-up care",
        ]}
        description="Our care model is designed to support patients beyond one-time procedures. We focus on long-term relationships and healthier smiles through continuity of care."
        eyebrow="Patient-first approach"
        title="We care for people, not just teeth"
        visualLabel="Patient-first One Dental Experience"
      />

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Our team</p>
        <h2 className="mt-1 text-3xl font-semibold text-primary sm:text-4xl">Meet our dental professionals</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <Card className="rounded-2xl border-border bg-card-strong" key={member.name}>
              <CardContent className="p-5">
                <div className="h-28 rounded-xl bg-gradient-to-br from-primary/20 via-card to-accent/15" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
