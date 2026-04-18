"use client";

import { useActionState } from "react";
import Link from "next/link";

import { createAppointment } from "@/features/appointments/actions/createAppointment";
import {
  INITIAL_APPOINTMENT_FORM_STATE,
  type AppointmentFormState,
  type AppointmentServiceOption,
  type AppointmentSlotOption,
} from "@/features/appointments/types";

type AppointmentFormProps = {
  services: AppointmentServiceOption[];
  slots: AppointmentSlotOption[];
};

export default function AppointmentForm({ services, slots }: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState<
    AppointmentFormState,
    FormData
  >(createAppointment, INITIAL_APPOINTMENT_FORM_STATE);

  const showErrorBanner = state.status === "error" && state.message;
  const showSuccess = state.status === "success";

  const fieldClassName =
    "mt-2 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30";

  return (
    <div className="space-y-5">
      {showSuccess ? (
        <section className="rounded-2xl border border-success-strong/20 bg-success-soft p-5">
          <h3 className="text-lg font-semibold text-success-strong">Appointment request received</h3>
          <p className="mt-2 text-sm text-foreground">
            {state.message ??
              "Your booking details were submitted successfully. Our clinic team will confirm your schedule soon."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong"
              href="/patient/appointments"
            >
              View my appointments
            </Link>
            {state.appointmentId ? (
              <Link
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
                href={`/patient/appointments/${state.appointmentId}`}
              >
                View booking details
              </Link>
            ) : null}
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              href="/"
            >
              Return home
            </Link>
          </div>
        </section>
      ) : null}

      {showErrorBanner ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-destructive"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {!showSuccess ? (
        <form action={formAction} className="space-y-5">
          <fieldset className="space-y-5" disabled={isPending}>
            <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Choose your service</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a treatment, then choose an available slot or provide your preferred date and
                  time.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="serviceId">
                  Service
                </label>
                <select
                  className={fieldClassName}
                  defaultValue=""
                  id="serviceId"
                  name="serviceId"
                  required
                >
                  <option disabled value="">
                    Select a service
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.durationMinutes} mins)
                    </option>
                  ))}
                </select>
                {state.errors?.serviceId?.[0] ? (
                  <p className="mt-1 text-sm text-destructive">{state.errors.serviceId[0]}</p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="slotId">
                  Available slot (optional)
                </label>
                <select className={fieldClassName} defaultValue="" id="slotId" name="slotId">
                  <option value="">No pre-defined slot</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.slotDate} | {slot.startTime}-{slot.endTime} ({slot.bookedCount}/
                      {slot.maxCapacity})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  If you choose a slot, the date and time below become optional.
                </p>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h3 className="text-base font-semibold text-foreground">Preferred schedule details</h3>

              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="scheduledAt">
                  Preferred date and time
                </label>
                <input
                  className={fieldClassName}
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                />
                {state.errors?.scheduledAt?.[0] ? (
                  <p className="mt-1 text-sm text-destructive">{state.errors.scheduledAt[0]}</p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground" htmlFor="reason">
                  Notes or reason for visit
                </label>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                  id="reason"
                  name="reason"
                  placeholder="Tell us what you need help with."
                  rows={4}
                />
                {state.errors?.reason?.[0] ? (
                  <p className="mt-1 text-sm text-destructive">{state.errors.reason[0]}</p>
                ) : null}
              </div>
            </section>
          </fieldset>

          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Submitting your request..." : "Book appointment"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
