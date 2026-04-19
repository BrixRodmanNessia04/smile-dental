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
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
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
            <p>123 One Dental Avenue, Dental City</p>
          </ContactInfoCard>

          <ContactInfoCard title="Phone">
            <p>
              <a className="font-medium text-foreground underline" href="tel:+15551234567">
                (555) 123-4567
              </a>
            </p>
          </ContactInfoCard>

          <ContactInfoCard title="Email">
            <p>
              <a className="font-medium text-foreground underline" href="mailto:support@onedental.com">
                support@onedental.com
              </a>
            </p>
          </ContactInfoCard>

          <ContactInfoCard title="Clinic hours">
            <ul className="space-y-1">
              {CLINIC_HOURS.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
          </ContactInfoCard>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="w-full sm:w-auto" size="lg" variant="accent">
              <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
              <a href={MAPS_OPEN_URL} rel="noreferrer" target="_blank">
                Open in Google Maps
              </a>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="overflow-hidden rounded-xl border border-border bg-secondary/30">
              <iframe
                className="aspect-video w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={MAP_EMBED_URL}
                title="One Dental location map"
              />
            </div>
            <p className="mt-3 px-1 text-xs text-muted-foreground">
              For exact parking and entrance instructions, call the clinic before your visit.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
