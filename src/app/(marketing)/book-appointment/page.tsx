import type { Metadata } from "next";
import Link from "next/link";

import AppointmentForm from "@/components/appointments/AppointmentForm";
import {
  listActiveServices,
  listAvailableSlots,
} from "@/features/appointments/services/appointment-query.service";
import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Book an Appointment",
  description:
    "Use One Dental's guided appointment flow to choose your service and preferred schedule in just a few steps.",
  path: "/book-appointment",
  keywords: ["book dental appointment", "One Dental booking", "dentist schedule"],
});

const BOOKING_STEPS = [
  "Choose your service and preferred schedule.",
  "Submit your booking request in under 2 minutes.",
  "Receive clinic confirmation and next-step guidance.",
] as const;

async function getCurrentRole() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return resolveUserRole(profile?.role, user);
}

export default async function Page() {
  const [role, servicesResult, slotsResult] = await Promise.all([
    getCurrentRole(),
    listActiveServices(),
    listAvailableSlots(),
  ]);

  const isPatient = role === USER_ROLES.PATIENT;
  const isAdmin = role === USER_ROLES.ADMIN;
  const hasServices = servicesResult.ok && servicesResult.data.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Appointment booking
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Book your visit in a few guided steps
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Share your preferred treatment and schedule. Our clinic team will review your request and
          confirm your appointment details quickly.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {BOOKING_STEPS.map((step, index) => (
            <article className="rounded-xl border border-border bg-card-strong p-3" key={step}>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm text-foreground">{step}</p>
            </article>
          ))}
        </div>
      </section>

      {!isPatient ? (
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Start booking with your patient account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For secure appointment records, booking currently requires a patient account.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {/* <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
              href={AUTH_ROUTES.PATIENT_REGISTER}
            >
              Create patient account
            </Link> */}
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              href={MARKETING_ROUTES.CONTACT}
            >
              Contact clinic
            </Link>
          </div>

          {servicesResult.ok && servicesResult.data.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {servicesResult.data.slice(0, 4).map((service) => (
                <article className="rounded-xl border border-border bg-card-strong p-4" key={service.id}>
                  <p className="text-sm font-semibold text-foreground">{service.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Typical duration: {service.durationMinutes} minutes
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {isAdmin ? (
        <p className="rounded-lg border border-warning-strong/30 bg-warning-soft px-4 py-3 text-sm text-warning-strong">
          This account is signed in as admin. Please use a patient account to create appointments.
        </p>
      ) : null}

      {!servicesResult.ok ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-destructive">
          {servicesResult.message}
        </p>
      ) : !hasServices ? (
        <p className="rounded-lg border border-border bg-card px-4 py-4 text-sm text-muted-foreground">
          No active services are available for booking right now. Please contact the clinic for
          assistance.
        </p>
      ) : isPatient ? (
        <section className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-start">
          <article className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-foreground">Appointment request form</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete the form below. All fields are optimized for mobile and desktop booking.
            </p>

            <div className="mt-5">
              <AppointmentForm
                services={servicesResult.data}
                slots={slotsResult.ok ? slotsResult.data : []}
              />
            </div>
          </article>

          <aside className="space-y-4">
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">Booking reminders</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Choose one service that best matches your visit reason.</li>
                <li>Use available slots when possible for faster confirmation.</li>
                <li>Add notes so the clinic can prepare ahead of your appointment.</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">What happens next</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                After submission, One Dental reviews your request and confirms schedule details.
                Adjustments may be offered if your preferred time is unavailable.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Need help now? <Link className="font-semibold text-primary hover:text-primary-strong" href={MARKETING_ROUTES.CONTACT}>Contact our clinic team</Link>.
              </p>
            </article>

            {!slotsResult.ok ? (
              <p className="rounded-lg border border-warning-strong/30 bg-warning-soft px-4 py-3 text-sm text-warning-strong">
                Available slots could not be loaded. You can still submit your preferred date and
                time.
              </p>
            ) : null}
          </aside>
        </section>
      ) : null}
    </main>
  );
}
