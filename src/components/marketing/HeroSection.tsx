import Link from "next/link";

import { MARKETING_ROUTES } from "@/lib/constants/routes";

const TRUST_METRICS = [
  { label: "Happy patients", value: "10k+" },
  { label: "Average rating", value: "4.9/5" },
  { label: "Licensed dentists", value: "12" },
] as const;

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 shadow-sm sm:px-8 lg:px-12 lg:py-14">
      <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            One Dental Care Platform
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted dental care with a modern, patient-first experience.
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            From preventive cleanings to restorative treatments, One Dental makes every visit
            clear, comfortable, and easy to manage online.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong"
              href={MARKETING_ROUTES.BOOK_APPOINTMENT}
            >
              Book Appointment
            </Link>
            <Link
              className="inline-flex rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              href={MARKETING_ROUTES.ABOUT}
            >
              Learn More
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {TRUST_METRICS.map((metric) => (
              <article className="rounded-lg border border-border bg-card-strong p-4" key={metric.label}>
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{metric.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
          <p className="text-sm font-semibold text-foreground">Next available appointments</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-medium text-foreground">Teeth Cleaning</p>
              <p className="text-xs text-muted-foreground">Monday, 10:00 AM</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-medium text-foreground">Consultation</p>
              <p className="text-xs text-muted-foreground">Tuesday, 2:30 PM</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-medium text-foreground">Whitening Session</p>
              <p className="text-xs text-muted-foreground">Thursday, 1:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
