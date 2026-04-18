import Link from "next/link";

import { listAdminAppointments } from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const appointmentsResult = await listAdminAppointments();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">All appointments</h1>

      {!appointmentsResult.ok ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {appointmentsResult.message}
        </p>
      ) : appointmentsResult.data.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No appointments found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-700">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Patient</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointmentsResult.data.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-3">{appointment.appointmentDate}</td>
                  <td className="px-4 py-3">
                    {appointment.startTime}-{appointment.endTime}
                  </td>
                  <td className="px-4 py-3">
                    {appointment.serviceName ?? appointment.serviceId}
                  </td>
                  <td className="px-4 py-3">{appointment.patientProfileId}</td>
                  <td className="px-4 py-3">{appointment.status}</td>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium text-slate-900 underline"
                      href={`/admin/appointments/${appointment.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
