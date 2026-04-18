import type { Metadata } from "next";
import Link from "next/link";

import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Our Dental Clinic",
  description:
    "Get in touch with our clinic for appointment scheduling, service inquiries, and patient support.",
  path: "/contact",
  keywords: ["contact dentist", "book dental appointment", "dental clinic phone"],
});

const CLINIC_HOURS = [
  "Monday to Friday: 8:00 AM - 6:00 PM",
  "Saturday: 9:00 AM - 3:00 PM",
  "Sunday: By appointment",
] as const;

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Contact One Dental
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">We are here to help</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Reach us for appointment support, treatment questions, and patient account concerns.
          Our clinic team responds during operating hours.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Clinic contact details</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>
              Email: <a className="font-medium text-foreground underline" href="mailto:support@onedental.com">support@onedental.com</a>
            </p>
            <p>
              Phone: <a className="font-medium text-foreground underline" href="tel:+15551234567">(555) 123-4567</a>
            </p>
            <p>Address: 123 One Dental Avenue, Dental City</p>
          </div>

          <div className="mt-5 rounded-lg border border-border bg-card-strong p-4">
            <h3 className="text-sm font-semibold text-foreground">Clinic hours</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {CLINIC_HOURS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Need to book or manage an appointment?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can book directly online and our clinic team will help confirm your schedule and
            next steps.
          </p>

          <div className="mt-5">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-center text-sm font-semibold text-accent-foreground transition hover:brightness-95"
              href={MARKETING_ROUTES.BOOK_APPOINTMENT}
            >
              Book Appointment
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            For urgent dental concerns, call the clinic directly so our team can assist you faster.
          </p>
        </article>
      </section>
    </main>
  );
}
