import type { AppointmentStatus } from "@/lib/constants/appointment-status";

export type Appointment = {
  id: string;
  patientProfileId: string;
  serviceId: string;
  serviceName: string | null;
  slotId: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  adminNotes: string | null;
  cancellationReason: string | null;
  status: AppointmentStatus;
  approvedBy: string | null;
  completedBy: string | null;
  cancelledBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentServiceOption = {
  id: string;
  name: string;
  durationMinutes: number;
};

export type AppointmentSlotOption = {
  id: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  isActive: boolean;
};

export type AppointmentFieldErrors = {
  appointmentId?: string[];
  serviceId?: string[];
  slotId?: string[];
  scheduledAt?: string[];
  reason?: string[];
  slotDate?: string[];
  startTime?: string[];
  endTime?: string[];
  maxCapacity?: string[];
  adminNotes?: string[];
};

export type AppointmentFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: AppointmentFieldErrors;
};

export const INITIAL_APPOINTMENT_FORM_STATE: AppointmentFormState = {
  status: "idle",
};

export type AppointmentServiceResult<T> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };
