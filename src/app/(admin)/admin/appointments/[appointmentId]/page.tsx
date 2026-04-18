import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import { approveAppointment } from "@/features/appointments/actions/approveAppointment";
import { cancelAppointment } from "@/features/appointments/actions/cancelAppointment";
import { completeAppointment } from "@/features/appointments/actions/completeAppointment";
import { rescheduleAppointment } from "@/features/appointments/actions/rescheduleAppointment";
import {
  getAdminAppointmentDetail,
  listAvailableSlots,
} from "@/features/appointments/services/appointment-query.service";

type PageProps = {
  params: Promise<{
    appointmentId: string;
  }>;
};

const toDateTimeLocalValue = (date: string, time: string) => `${date}T${time.slice(0, 5)}`;

export default async function Page({ params }: PageProps) {
  const { appointmentId } = await params;
  const [appointmentResult, slotsResult] = await Promise.all([
    getAdminAppointmentDetail(appointmentId),
    listAvailableSlots(100),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link className="text-sm font-medium text-slate-900 underline" href="/admin/appointments">
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
              <p className="mt-1 text-xs text-slate-500">
                Patient profile: {appointmentResult.data.patientProfileId}
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
          </dl>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <form action={approveAppointment} className="space-y-2 rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Approve</h2>
              <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                name="adminNotes"
                placeholder="Optional admin notes"
                rows={3}
              />
              <button className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600" type="submit">
                Approve appointment
              </button>
            </form>

            <form action={rescheduleAppointment} className="space-y-2 rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Reschedule</h2>
              <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                defaultValue=""
                name="slotId"
              >
                <option value="">No pre-defined slot</option>
                {slotsResult.ok
                  ? slotsResult.data.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.slotDate} {slot.startTime}-{slot.endTime} ({slot.bookedCount}/
                        {slot.maxCapacity})
                      </option>
                    ))
                  : null}
              </select>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                defaultValue={toDateTimeLocalValue(
                  appointmentResult.data.appointmentDate,
                  appointmentResult.data.startTime,
                )}
                name="scheduledAt"
                required
                type="datetime-local"
              />
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                name="adminNotes"
                placeholder="Reason for reschedule"
                rows={3}
              />
              <button className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-600" type="submit">
                Reschedule
              </button>
            </form>

            <form action={cancelAppointment} className="space-y-2 rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Cancel</h2>
              <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                name="adminNotes"
                placeholder="Cancellation reason"
                rows={3}
              />
              <button className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-600" type="submit">
                Cancel appointment
              </button>
            </form>

            <form action={completeAppointment} className="space-y-2 rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Complete</h2>
              <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                name="adminNotes"
                placeholder="Completion notes"
                rows={3}
              />
              <button className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-600" type="submit">
                Complete appointment
              </button>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
