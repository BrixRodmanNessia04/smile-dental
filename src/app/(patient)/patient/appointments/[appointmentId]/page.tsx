import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import { getPatientAppointmentDetail } from "@/features/appointments/services/appointment-query.service";

type PageProps = {
  params: Promise<{
    appointmentId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { appointmentId } = await params;
  const appointmentResult = await getPatientAppointmentDetail(appointmentId);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link className="text-sm font-medium text-slate-900 underline" href="/patient/appointments">
        Back to appointments
      </Link>

      {!appointmentResult.ok ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {appointmentResult.message}
        </p>
      ) : (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {appointmentResult.data.serviceName ?? appointmentResult.data.serviceId}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {appointmentResult.data.appointmentDate}{" "}
                {appointmentResult.data.startTime}-{appointmentResult.data.endTime}
              </p>
            </div>
            <AppointmentStatusBadge status={appointmentResult.data.status} />
          </div>

          <dl className="mt-6 space-y-3 text-sm text-slate-700">
            <div>
              <dt className="font-medium text-slate-900">Reason</dt>
              <dd>{appointmentResult.data.reason || "None"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Admin notes</dt>
              <dd>{appointmentResult.data.adminNotes || "None"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Cancellation reason</dt>
              <dd>{appointmentResult.data.cancellationReason || "None"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Created</dt>
              <dd>{appointmentResult.data.createdAt}</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
