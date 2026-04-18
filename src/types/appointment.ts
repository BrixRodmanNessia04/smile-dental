import type { AppointmentStatus } from "@/lib/constants/appointment-status";

export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration_minutes: number;
  base_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AppointmentSlotRow = {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  booked_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type AppointmentRow = {
  id: string;
  patient_profile_id: string;
  service_id: string;
  slot_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  reason: string | null;
  admin_notes: string | null;
  cancellation_reason: string | null;
  approved_by: string | null;
  completed_by: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentStatusLogRow = {
  id: string;
  appointment_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string;
  notes: string | null;
  created_at: string;
};

export type Service = ServiceRow;
export type AppointmentSlot = AppointmentSlotRow;
export type Appointment = AppointmentRow;
export type AppointmentStatusLog = AppointmentStatusLogRow;
