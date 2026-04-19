import type { Metadata } from "next";
import Link from "next/link";

import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentHero from "@/components/marketing/AppointmentHero";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import {
  listAvailableSlots,
} from "@/features/appointments/services/appointment-query.service";
import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { getStaticAppointmentServices } from "@/lib/constants/services";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Book an Appointment",
  description:
    "Book your One Dental appointment using a guided mobile-friendly form with live service options.",
  path: "/book-appointment",
  keywords: ["One Dental booking", "book dental appointment", "dental schedule"],
});

type BookingContext = {
  role: ReturnType<typeof resolveUserRole>;
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
};

async function getBookingContext(): Promise<BookingContext | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, email, phone")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const firstName = profile?.first_name?.trim() ?? "";
  const lastName = profile?.last_name?.trim() ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    role: resolveUserRole(profile?.role, user),
    contact: {
      fullName,
      email: profile?.email ?? user.email ?? "",
      phone: profile?.phone ?? "",
    },
  };
}

export default async function Page() {
  const [bookingContext, slotsResult] = await Promise.all([
    getBookingContext(),
    listAvailableSlots(),
  ]);
  const staticServices = getStaticAppointmentServices();

  const role = bookingContext?.role ?? null;
  const isPatient = role === USER_ROLES.PATIENT;
  const isAdmin = role === USER_ROLES.ADMIN;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <AppointmentHero />

      {isPatient ? (
        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <Card className="rounded-3xl border-border">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-primary">Appointment request form</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete each step below. Service options follow our One Dental MVP service lineup.
              </p>

              <div className="mt-5">
                <AppointmentForm
                  initialContact={bookingContext?.contact}
                  services={staticServices}
                  slots={slotsResult.ok ? slotsResult.data : []}
                />
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card className="rounded-2xl border-border bg-card-strong">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                  Booking tips
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Choose the service that best matches your concern.</li>
                  <li>Use available slots for faster clinic confirmation.</li>
                  <li>Add clear notes so the team can prepare in advance.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card-strong">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                  Need help now?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  If you need immediate assistance, contact our clinic team and we&apos;ll guide you
                  through the best next step.
                </p>
                <div className="mt-4">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={MARKETING_ROUTES.CONTACT}>Contact clinic</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!slotsResult.ok ? (
              <p className="rounded-lg border border-warning-strong/30 bg-warning-soft px-4 py-3 text-sm text-warning-strong">
                Available slots could not be loaded. You can still submit preferred date and time.
              </p>
            ) : null}
          </aside>
        </section>
      ) : (
        <Card className="rounded-3xl border-border">
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">Booking access</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Online booking currently requires a patient account session. Please contact One Dental
              so our team can help schedule your appointment.
            </p>
            {isAdmin ? (
              <p className="mt-3 rounded-lg border border-warning-strong/30 bg-warning-soft px-3 py-2 text-sm text-warning-strong">
                You are currently signed in as an admin account.
              </p>
            ) : null}
            <div className="mt-4">
              <Button asChild variant="accent">
                <Link href={MARKETING_ROUTES.CONTACT}>Contact clinic</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
