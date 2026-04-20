import type { Metadata } from "next";

import PublicAppointmentForm from "@/components/appointments/PublicAppointmentForm";
import AppointmentHero from "@/components/marketing/AppointmentHero";
import Card, { CardContent } from "@/components/ui/card";
import { getStaticAppointmentServices } from "@/lib/constants/services";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Book an Appointment",
  description:
    "Book your One Dental appointment using a guided mobile-friendly form and curated service options.",
  path: "/book-appointment",
  keywords: ["One Dental booking", "book dental appointment", "dental schedule"],
});

export default function Page() {
  const staticServices = getStaticAppointmentServices();

  return (
    <main className="marketing-page mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="space-y-5">
          <AppointmentHero />

          <Card className="rounded-2xl border-border bg-card-strong">
            <CardContent className="p-5 pt-5 sm:p-6">
              <h2 className="text-lg font-semibold text-primary">
                Before you submit
              </h2>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>Choose the service that best matches your concern.</li>
                <li>
                  Share your preferred date and time so the clinic can confirm
                  availability.
                </li>
                <li>
                  Add notes about pain, sensitivity, cosmetic goals, or timing
                  constraints.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5">
            <CardContent className="p-5 pt-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                What happens next
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your request is emailed to the One Dental team. A team member
                will review the details and contact you to finalize the
                schedule.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-border bg-card shadow-[0_24px_64px_-46px_hsl(var(--shadow))]">
          <CardContent className="p-5 pt-5 sm:p-6 lg:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Public appointment request
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">
              Tell us when you would like to visit
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No login is required. Complete the form and we&apos;ll follow up
              to confirm your appointment.
            </p>

            <div className="mt-6">
              <PublicAppointmentForm services={staticServices} />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
