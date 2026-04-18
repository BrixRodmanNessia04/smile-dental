import Link from "next/link";

import type { Appointment } from "@/features/appointments/types";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

type AppointmentCardProps = {
  appointment: Appointment;
  href: string;
  showPatientId?: boolean;
};

const formatDateTime = (date: string, startTime: string, endTime: string) =>
  `${date} ${startTime}-${endTime}`;

export default function AppointmentCard({
  appointment,
  href,
  showPatientId = false,
}: AppointmentCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {appointment.serviceName ?? appointment.serviceId}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {formatDateTime(
              appointment.appointmentDate,
              appointment.startTime,
              appointment.endTime,
            )}
          </p>
          {showPatientId ? (
            <p className="mt-1 text-xs text-slate-500">
              Patient: {appointment.patientProfileId}
            </p>
          ) : null}
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      {appointment.reason ? (
        <p className="mt-3 text-sm text-slate-700">{appointment.reason}</p>
      ) : null}

      <div className="mt-4">
        <Link className="text-sm font-medium text-slate-900 underline" href={href}>
          View details
        </Link>
      </div>
    </article>
  );
}
