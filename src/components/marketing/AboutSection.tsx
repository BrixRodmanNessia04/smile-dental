import Link from "next/link";

import SectionHeader from "@/components/shared/SectionHeader";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

const DOCTORS = [
  { name: "Dr. Maria Santos", role: "Lead Dentist" },
  { name: "Dr. Ethan Reyes", role: "Orthodontics" },
  { name: "Dr. Claire Tan", role: "Pediatric Dentistry" },
] as const;

export default function AboutSection() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8" id="about">
      <SectionHeader
        action={
          <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href={MARKETING_ROUTES.ABOUT}>
            Learn More
          </Link>
        }
        description="One Dental combines compassionate clinicians with digital-first patient support."
        title="About One Dental"
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-lg border border-border bg-card-strong p-5">
          <h3 className="text-base font-semibold text-foreground">A clinic built around trust</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Our care model emphasizes transparent treatment plans, preventive education, and gentle
            chairside support so every patient feels informed and confident.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xl font-semibold text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">Patient satisfaction</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xl font-semibold text-foreground">24h</p>
              <p className="text-xs text-muted-foreground">Response turnaround</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xl font-semibold text-foreground">6 days</p>
              <p className="text-xs text-muted-foreground">Weekly availability</p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-background p-5">
          <h3 className="text-base font-semibold text-foreground">Our dental team</h3>
          <div className="mt-3 space-y-3">
            {DOCTORS.map((doctor) => (
              <div className="rounded-lg border border-border bg-card p-3" key={doctor.name}>
                <p className="text-sm font-semibold text-foreground">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">{doctor.role}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
