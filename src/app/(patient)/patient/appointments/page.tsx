import Link from "next/link";

import AppointmentCard from "@/components/appointments/AppointmentCard";
import { listPatientAppointments } from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const appointmentsResult = await listPatientAppointments();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">My appointments</h1>
        <Link
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          href="/patient/appointments/new"
        >
          New appointment
        </Link>
      </div>

      {!appointmentsResult.ok ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {appointmentsResult.message}
        </p>
      ) : appointmentsResult.data.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          You have no appointments yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {appointmentsResult.data.map((appointment) => (
            <AppointmentCard
              appointment={appointment}
              href={`/patient/appointments/${appointment.id}`}
              key={appointment.id}
            />
          ))}
        </div>
      )}
    </main>
  );
}
