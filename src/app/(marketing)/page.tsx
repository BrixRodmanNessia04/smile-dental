import type { Metadata } from "next";
import Link from "next/link";

import { listActiveServices } from "@/features/appointments/services/appointment-query.service";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "One Dental | Trusted Dental Care, Easy Online Booking",
  description:
    "Book your One Dental appointment in minutes. Explore services, meet a patient-first clinic team, and schedule with confidence.",
  path: "/",
  keywords: ["One Dental", "dental clinic", "book appointment", "trusted dentist", "patient-first care"],
});

const FALLBACK_SERVICES = [
  { id: "s1", name: "Dental Checkup", durationMinutes: 30 },
  { id: "s2", name: "Professional Cleaning", durationMinutes: 45 },
  { id: "s3", name: "Teeth Whitening", durationMinutes: 60 },
  { id: "s4", name: "Restorative Treatment", durationMinutes: 60 },
] as const;

const TRUST_ITEMS = [
  {
    title: "Patient-first care",
    description: "Clear treatment plans, transparent recommendations, and compassionate support.",
  },
  {
    title: "Experienced dentists",
    description: "Skilled clinicians focused on preventive and long-term oral health outcomes.",
  },
  {
    title: "Modern, comfortable visits",
    description: "Efficient digital booking and a calm clinic environment built for convenience.",
  },
] as const;

function getServiceDescription(name: string, durationMinutes: number) {
  return `${name} appointments are typically around ${durationMinutes} minutes with tailored guidance from our clinical team.`;
}

function TrustIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3 4 7v5c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V7l-8-4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-7 15a7 7 0 0 1 14 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M8 12h8M8 15h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

export default async function Page() {
  const servicesResult = await listActiveServices();
  const services = servicesResult.ok
    ? servicesResult.data.slice(0, 6)
    : [...FALLBACK_SERVICES];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute -right-24 -top-16 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              One Dental
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Trusted dental care with booking that takes just a few minutes.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              One Dental combines experienced clinicians, patient-first care, and a modern booking
              flow so you can schedule with confidence from any device.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
                href={MARKETING_ROUTES.BOOK_APPOINTMENT}
              >
                Book Appointment
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted"
                href={MARKETING_ROUTES.SERVICES}
              >
                View Services
              </Link>
            </div>
          </div>

          <article className="rounded-2xl border border-border bg-background p-5">
            <h2 className="text-sm font-semibold text-foreground">Clinic highlights</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="rounded-lg border border-border bg-card p-3">Same-day response for booking requests</p>
              <p className="rounded-lg border border-border bg-card p-3">Comfort-focused treatment environment</p>
              <p className="rounded-lg border border-border bg-card p-3">Monday to Saturday clinic hours</p>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Services preview
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
              Care options tailored to your needs
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-primary transition hover:text-primary-strong"
            href={MARKETING_ROUTES.SERVICES}
          >
            View all services
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article className="rounded-xl border border-border bg-card-strong p-4 sm:p-5" key={service.id}>
              <h3 className="text-base font-semibold text-foreground">{service.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {service.durationMinutes} minutes
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {getServiceDescription(service.name, service.durationMinutes)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Why choose One Dental
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
          A trustworthy clinic experience from first click to follow-up care
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map((item, index) => (
            <article className="rounded-xl border border-border bg-card-strong p-5" key={item.title}>
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <TrustIcon index={index} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-primary px-5 py-8 text-primary-foreground shadow-sm sm:px-8 sm:py-10">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to book your visit?</h2>
            <p className="mt-2 text-sm text-primary-foreground/90 sm:text-base">
              Share your preferred date and service in our guided flow. We will confirm your
              schedule quickly.
            </p>
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
            href={MARKETING_ROUTES.BOOK_APPOINTMENT}
          >
            Book Appointment
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Clinic information
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">Visit or contact us</h2>
          </div>
          <Link
            className="text-sm font-semibold text-primary transition hover:text-primary-strong"
            href={MARKETING_ROUTES.CONTACT}
          >
            Contact page
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card-strong p-4">
            <h3 className="text-sm font-semibold text-foreground">Address</h3>
            <p className="mt-2 text-sm text-muted-foreground">123 One Dental Avenue, Dental City</p>
          </article>
          <article className="rounded-xl border border-border bg-card-strong p-4">
            <h3 className="text-sm font-semibold text-foreground">Contact number</h3>
            <p className="mt-2 text-sm text-muted-foreground">(555) 123-4567</p>
          </article>
          <article className="rounded-xl border border-border bg-card-strong p-4">
            <h3 className="text-sm font-semibold text-foreground">Opening hours</h3>
            <p className="mt-2 text-sm text-muted-foreground">Mon-Fri 8:00 AM - 6:00 PM</p>
            <p className="text-sm text-muted-foreground">Sat 9:00 AM - 3:00 PM</p>
          </article>
        </div>
      </section>
    </main>
  );
}
