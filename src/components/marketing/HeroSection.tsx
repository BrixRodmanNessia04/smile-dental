import Link from "next/link";
import Image from "next/image";

import Button from "@/components/ui/button";
import { IMAGES } from "@/lib/constants/images";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.1rem] border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 px-5 py-8 shadow-[0_28px_80px_-46px_hsl(var(--shadow))] sm:px-7 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/16 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            One Dental
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-5xl">
            Exceptional dental care for a brighter, healthier smile
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Comfortable, modern dentistry centered around your needs. Book appointments in a few
            clicks and get personalized treatment plans from a patient-first team.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="accent">
                <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
              </Button>
              <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="outline">
                <Link href={MARKETING_ROUTES.SERVICES}>View Services</Link>
              </Button>
            </div>

            {/* <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/80 bg-background/78 px-3 py-2 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-accent" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg className="h-3.5 w-3.5" fill="currentColor" key={index} viewBox="0 0 20 20">
                    <path d="m10 2.5 2.3 4.6 5 .7-3.6 3.5.9 5-4.6-2.4-4.6 2.4.9-5L2.7 7.8l5-.7L10 2.5Z" />
                  </svg>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none text-primary">4.9/5 rating</p>
                <p className="mt-1 text-xs text-muted-foreground">350+ verified patient reviews</p>
              </div>
            </div> */}
          </div>
        </div>

        <div className="marketing-card-hover relative overflow-hidden rounded-[1.7rem] border border-border/65 bg-secondary/20 shadow-[0_24px_52px_-42px_hsl(var(--shadow))]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[5/4]">
            <Image
              alt="Dentist providing treatment to a smiling patient at One Dental"
              className="object-cover"
              fill
              preload
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 600px"
              src={IMAGES.home.hero}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/22 via-transparent to-card/8" />
            <div className="absolute left-4 top-4 rounded-full bg-background/82 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              Patient-first care
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
