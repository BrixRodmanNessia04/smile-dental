"use client";

import { useActionState } from "react";

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

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <p
          className={
            state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="serviceId">
          Service
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
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
          <p className="text-sm text-red-600">{state.errors.serviceId[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="slotId">
          Appointment slot (optional)
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          defaultValue=""
          id="slotId"
          name="slotId"
        >
          <option value="">No pre-defined slot</option>
          {slots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.slotDate} {slot.startTime}-{slot.endTime} ({slot.bookedCount}/{slot.maxCapacity})
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          If you select a slot, date/time below is optional and slot values will be used.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="scheduledAt">
          Preferred date and time
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
        />
        {state.errors?.scheduledAt?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.scheduledAt[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="reason">
          Reason
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          id="reason"
          name="reason"
          placeholder="Tell us briefly why you need this appointment"
          rows={4}
        />
        {state.errors?.reason?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.reason[0]}</p>
        ) : null}
      </div>

      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Booking..." : "Book appointment"}
      </button>
    </form>
  );
}
