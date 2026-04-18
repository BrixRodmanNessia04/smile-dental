import Link from "next/link";

import { AUTH_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

export default function CTASection() {
  return (
    <section className="rounded-3xl border border-border bg-primary px-6 py-10 text-primary-foreground shadow-sm sm:px-8 sm:py-12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            Book your appointment today
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/90 sm:text-base">
            Reserve your slot in minutes and manage visits, updates, and rewards from one patient
            portal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
            href={MARKETING_ROUTES.BOOK_APPOINTMENT}
          >
            Book Appointment
          </Link>
          <Link
            className="rounded-lg border border-primary-foreground/35 px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
            href={AUTH_ROUTES.PATIENT_LOGIN}
          >
            Patient Login
          </Link>
        </div>
      </div>
    </section>
  );
}
