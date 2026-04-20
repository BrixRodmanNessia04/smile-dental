import Link from "next/link";

import Button from "@/components/ui/button";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

export default function CTASection() {
  return (
    <section className="rounded-[1.75rem] border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 px-5 py-12 shadow-sm sm:px-8 sm:py-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Start your smile journey</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          Achieve the healthy smile you&apos;ve always wanted
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Meet our patient-first team and get a personalized treatment plan with modern, comfortable
          dental care.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="outline">
            <Link href={MARKETING_ROUTES.SERVICES}>View Services</Link>
          </Button>
          <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="accent">
            <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
