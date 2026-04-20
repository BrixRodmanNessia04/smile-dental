import type { Metadata } from "next";
import Link from "next/link";

import ContactInfoCard from "@/components/marketing/ContactInfoCard";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Visit One Dental",
  description:
    "Find One Dental's address, contact details, clinic hours, and location map for your next visit.",
  path: "/contact",
  keywords: ["One Dental contact", "dental clinic location", "visit dentist", "clinic hours"],
});

const MAP_EMBED_URL = "https://www.google.com/maps?q=123+One+Dental+Avenue,+Dental+City&z=15&output=embed";
const MAPS_OPEN_URL = "https://maps.google.com/?q=123+One+Dental+Avenue,+Dental+City";

const CLINIC_HOURS = [
  "Monday to Friday: 8:00 AM - 6:00 PM",
  "Saturday: 9:00 AM - 3:00 PM",
  "Sunday: By appointment",
] as const;

export default function Page() {
  return (
    <main className="marketing-page mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Visit our clinic</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          Contact One Dental and find us with ease
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Reach out for appointments, treatment questions, and clinic directions. Placeholder
          details below can be replaced with your final published information.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          <ContactInfoCard title="Address">
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              123 One Dental Avenue, Dental City
            </p>
          </ContactInfoCard>

          <ContactInfoCard title="Phone">
            <p className="mt-1 text-sm">
              <a
                className="font-medium text-primary transition hover:underline"
                href="tel:+15551234567"
              >
                (555) 123-4567
              </a>
            </p>
          </ContactInfoCard>

          <ContactInfoCard title="Email">
            <p className="mt-1 text-sm">
              <a
                className="font-medium text-primary transition hover:underline"
                href="mailto:support@onedental.com"
              >
                support@onedental.com
              </a>
            </p>
          </ContactInfoCard>

          <ContactInfoCard title="Clinic hours">
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {CLINIC_HOURS.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
          </ContactInfoCard>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="accent">
              <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
            </Button>
            <Button asChild className="marketing-button-hover w-full sm:w-auto" size="lg" variant="outline">
              <a href={MAPS_OPEN_URL} rel="noreferrer" target="_blank">
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>

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
      </section>
    </main>
  );
}
