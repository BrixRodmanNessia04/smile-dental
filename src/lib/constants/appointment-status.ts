export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  RESCHEDULED: "rescheduled",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  NO_SHOW: "no_show",
  REJECTED: "rejected",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export function isAppointmentStatus(value: unknown): value is AppointmentStatus {
  return Object.values(APPOINTMENT_STATUS).includes(value as AppointmentStatus);
}
