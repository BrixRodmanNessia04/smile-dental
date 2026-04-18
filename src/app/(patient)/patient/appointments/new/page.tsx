import Link from "next/link";

import AppointmentForm from "@/components/appointments/AppointmentForm";
import {
  listActiveServices,
  listAvailableSlots,
} from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const [servicesResult, slotsResult] = await Promise.all([
    listActiveServices(),
    listAvailableSlots(),
  ]);
  const hasServices = servicesResult.ok && servicesResult.data.length > 0;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">New appointment</h1>
        <p className="mt-1 text-sm text-slate-600">
          Submit your preferred schedule and service details.
        </p>
        {!servicesResult.ok || !slotsResult.ok ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Unable to load services or slots.
          </p>
        ) : !hasServices ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No active services are available for booking right now.
          </p>
        ) : (
          <div className="mt-6">
            <AppointmentForm
              services={servicesResult.data}
              slots={slotsResult.ok ? slotsResult.data : []}
            />
          </div>
        )}
        <Link
          className="mt-5 inline-block text-sm font-medium text-slate-900 underline"
          href="/patient/appointments"
        >
          Back to appointments
        </Link>
      </section>
    </main>
  );
}
