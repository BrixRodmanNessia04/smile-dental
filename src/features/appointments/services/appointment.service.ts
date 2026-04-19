import type { SupabaseClient, User } from "@supabase/supabase-js";

import { resolveUserRole } from "@/lib/auth/roles";
import { APPOINTMENT_STATUS, type AppointmentStatus } from "@/lib/constants/appointment-status";
import { USER_ROLES, type UserRole } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import {
  notifyAppointmentApproved,
  notifyAppointmentCancelled,
  notifyAppointmentCompleted,
  notifyAppointmentCreated,
  notifyAppointmentRescheduled,
} from "@/features/notifications/services/notification.service";

import type {
  CreateAppointmentInput,
  CreateAppointmentSlotInput,
  RescheduleAppointmentInput,
  UpdateAppointmentStatusInput,
} from "../schemas/appointment.schema";
import type {
  Appointment,
  AppointmentServiceResult,
  AppointmentSlotOption,
} from "../types";
import { addMinutesToTime, parseScheduledAtParts } from "./schedule.service";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type AppointmentSlotRow = Database["public"]["Tables"]["appointment_slots"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

type ActorContext = {
  supabase: SupabaseClient<Database>;
  user: User;
  profileId: string;
  role: UserRole | null;
};

const mapAppointment = (
  row: AppointmentRow,
  serviceName: string | null = null,
): Appointment => ({
  id: row.id,
  patientProfileId: row.patient_profile_id,
  serviceId: row.service_id,
  serviceName,
  slotId: row.slot_id,
  appointmentDate: row.appointment_date,
  startTime: row.start_time,
  endTime: row.end_time,
  reason: row.reason,
  adminNotes: row.admin_notes,
  cancellationReason: row.cancellation_reason,
  status: row.status,
  approvedBy: row.approved_by,
  completedBy: row.completed_by,
  cancelledBy: row.cancelled_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSlot = (row: AppointmentSlotRow): AppointmentSlotOption => ({
  id: row.id,
  slotDate: row.slot_date,
  startTime: row.start_time,
  endTime: row.end_time,
  maxCapacity: row.max_capacity,
  bookedCount: row.booked_count,
  isActive: row.is_active,
});

const unauthorized = <T>(): AppointmentServiceResult<T> => ({
  ok: false,
  message: "You are not authorized to perform this action.",
});

async function getActorContext(): Promise<AppointmentServiceResult<ActorContext>> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorized();
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false,
      message: "Unable to validate your account role.",
    };
  }

  return {
    ok: true,
    data: {
      supabase,
      user,
      profileId: profile.id,
      role: resolveUserRole(profile.role, user),
    },
  };
}

function ensureRole(role: UserRole | null, expected: UserRole): AppointmentServiceResult<null> {
  if (role !== expected) {
    return unauthorized();
  }

  return { ok: true, data: null };
}

async function getServiceByReference(
  supabase: SupabaseClient<Database>,
  serviceRef: string,
): Promise<ServiceRow | null> {
  const byIdQuery = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceRef)
    .eq("is_active", true)
    .maybeSingle();

  if (!byIdQuery.error && byIdQuery.data) {
    return byIdQuery.data;
  }

  const bySlugQuery = await supabase
    .from("services")
    .select("*")
    .eq("slug", serviceRef)
    .eq("is_active", true)
    .maybeSingle();

  if (bySlugQuery.error || !bySlugQuery.data) {
    return null;
  }

  return bySlugQuery.data;
}

async function getSlotById(
  supabase: SupabaseClient<Database>,
  slotId: string,
): Promise<AppointmentSlotRow | null> {
  const { data, error } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("id", slotId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

function toMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function isStartBeforeEnd(start: string, end: string): boolean {
  return toMinutes(start) < toMinutes(end);
}

async function adjustSlotBookedCount(
  supabase: SupabaseClient<Database>,
  slotId: string,
  delta: number,
): Promise<boolean> {
  const slot = await getSlotById(supabase, slotId);
  if (!slot) {
    return false;
  }

  const nextBookedCount = slot.booked_count + delta;
  if (nextBookedCount < 0 || nextBookedCount > slot.max_capacity) {
    return false;
  }

  const { error } = await supabase
    .from("appointment_slots")
    .update({
      booked_count: nextBookedCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slotId);

  return !error;
}

async function createAppointmentStatusLog(
  supabase: SupabaseClient<Database>,
  input: {
    appointmentId: string;
    oldStatus: string | null;
    newStatus: string;
    changedBy: string;
    notes?: string | null;
  },
) {
  await supabase.from("appointment_status_logs").insert({
    appointment_id: input.appointmentId,
    old_status: input.oldStatus,
    new_status: input.newStatus,
    changed_by: input.changedBy,
    notes: input.notes ?? null,
  });
}

async function buildDateTimeFromInput(
  supabase: SupabaseClient<Database>,
  input: {
    slotId?: string | null;
    scheduledAt?: string | null;
    serviceId: string;
  },
): Promise<
  | {
      ok: true;
      data: {
        slot: AppointmentSlotRow | null;
        appointmentDate: string;
        startTime: string;
        endTime: string;
        service: ServiceRow;
      };
    }
  | {
      ok: false;
      message: string;
    }
> {
  const service = await getServiceByReference(supabase, input.serviceId);
  if (!service) {
    return {
      ok: false,
      message: "Selected service is not available.",
    };
  }

  if (input.slotId) {
    const slot = await getSlotById(supabase, input.slotId);
    if (!slot) {
      return {
        ok: false,
        message: "Selected slot is not available.",
      };
    }

    if (slot.booked_count >= slot.max_capacity) {
      return {
        ok: false,
        message: "Selected slot is already full.",
      };
    }

    return {
      ok: true,
      data: {
        slot,
        appointmentDate: slot.slot_date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        service,
      },
    };
  }

  if (!input.scheduledAt) {
    return {
      ok: false,
      message: "Please choose a date and time.",
    };
  }

  const parsed = parseScheduledAtParts(input.scheduledAt);
  if (!parsed) {
    return {
      ok: false,
      message: "Invalid appointment date and time.",
    };
  }

  const endTime = addMinutesToTime(parsed.startTime, service.duration_minutes);
  if (!endTime || !isStartBeforeEnd(parsed.startTime, endTime)) {
    return {
      ok: false,
      message: "Unable to compute appointment time window.",
    };
  }

  return {
    ok: true,
    data: {
      slot: null,
      appointmentDate: parsed.appointmentDate,
      startTime: parsed.startTime,
      endTime,
      service,
    },
  };
}

async function getAdminAppointmentContext(
  appointmentId: string,
): Promise<
  AppointmentServiceResult<{
    supabase: SupabaseClient<Database>;
    appointment: AppointmentRow;
    adminProfileId: string;
  }>
> {
  const contextResult = await getActorContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, role, profileId } = contextResult.data;
  const roleCheck = ensureRole(role, USER_ROLES.ADMIN);
  if (!roleCheck.ok) {
    return roleCheck;
  }

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !appointment) {
    return {
      ok: false,
      message: "Appointment not found.",
    };
  }

  return {
    ok: true,
    data: {
      supabase,
      appointment,
      adminProfileId: profileId,
    },
  };
}

async function updateStatusByAdmin(
  input: {
    appointment: AppointmentRow;
    adminProfileId: string;
    nextStatus: AppointmentStatus;
    adminNotes?: string;
    cancellationReason?: string;
  },
  supabase: SupabaseClient<Database>,
): Promise<AppointmentServiceResult<AppointmentRow>> {
  const patch: Database["public"]["Tables"]["appointments"]["Update"] = {
    status: input.nextStatus,
    admin_notes: input.adminNotes ?? input.appointment.admin_notes,
    updated_at: new Date().toISOString(),
  };

  if (input.nextStatus === APPOINTMENT_STATUS.APPROVED) {
    patch.approved_by = input.adminProfileId;
  }

  if (input.nextStatus === APPOINTMENT_STATUS.COMPLETED) {
    patch.completed_by = input.adminProfileId;
  }

  if (input.nextStatus === APPOINTMENT_STATUS.CANCELLED) {
    patch.cancelled_by = input.adminProfileId;
    patch.cancellation_reason = input.cancellationReason ?? input.appointment.cancellation_reason;
  }

  const { data, error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", input.appointment.id)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to update appointment.",
    };
  }

  await createAppointmentStatusLog(supabase, {
    appointmentId: data.id,
    oldStatus: input.appointment.status,
    newStatus: data.status,
    changedBy: input.adminProfileId,
    notes: input.adminNotes,
  });

  return {
    ok: true,
    data,
  };
}

export async function createPatientAppointment(
  input: CreateAppointmentInput,
): Promise<AppointmentServiceResult<Appointment>> {
  const contextResult = await getActorContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, role, profileId } = contextResult.data;
  const roleCheck = ensureRole(role, USER_ROLES.PATIENT);
  if (!roleCheck.ok) {
    return roleCheck;
  }

  const scheduledAt =
    input.appointmentDate && input.appointmentTime
      ? `${input.appointmentDate}T${input.appointmentTime}`
      : undefined;

  const timeResult = await buildDateTimeFromInput(supabase, {
    slotId: input.slotId,
    scheduledAt,
    serviceId: input.serviceId,
  });

  if (!timeResult.ok) {
    return timeResult;
  }

  const { slot, appointmentDate, startTime, endTime, service } = timeResult.data;
  const reasonValue = [
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    input.reason ? `Notes: ${input.reason}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  if (reasonValue.length > 1000) {
    return {
      ok: false,
      message: "Your booking notes are too long. Please shorten and submit again.",
    };
  }

  if (slot) {
    const reserved = await adjustSlotBookedCount(supabase, slot.id, 1);
    if (!reserved) {
      return {
        ok: false,
        message: "Unable to reserve selected slot.",
      };
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_profile_id: profileId,
      service_id: input.serviceId,
      slot_id: slot?.id ?? null,
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
      status: APPOINTMENT_STATUS.PENDING,
      reason: reasonValue,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (slot) {
      await adjustSlotBookedCount(supabase, slot.id, -1);
    }

    return {
      ok: false,
      message: "Unable to create appointment.",
    };
  }

  await createAppointmentStatusLog(supabase, {
    appointmentId: data.id,
    oldStatus: null,
    newStatus: data.status,
    changedBy: profileId,
    notes: input.reason,
  });

  await notifyAppointmentCreated({
    recipientProfileId: data.patient_profile_id,
    appointmentId: data.id,
    appointmentDate: data.appointment_date,
    startTime: data.start_time,
  });

  return {
    ok: true,
    data: mapAppointment(data, service.name),
  };
}

export async function createAppointmentSlotByAdmin(
  input: CreateAppointmentSlotInput,
): Promise<AppointmentServiceResult<AppointmentSlotOption>> {
  const contextResult = await getActorContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, role, profileId } = contextResult.data;
  const roleCheck = ensureRole(role, USER_ROLES.ADMIN);
  if (!roleCheck.ok) {
    return roleCheck;
  }

  if (!isStartBeforeEnd(input.startTime, input.endTime)) {
    return {
      ok: false,
      message: "Start time must be earlier than end time.",
    };
  }

  const { data, error } = await supabase
    .from("appointment_slots")
    .insert({
      slot_date: input.slotDate,
      start_time: input.startTime,
      end_time: input.endTime,
      max_capacity: input.maxCapacity,
      created_by: profileId,
    })
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to create appointment slot.",
    };
  }

  return {
    ok: true,
    data: mapSlot(data),
  };
}

export async function approveAppointmentByAdmin(
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentServiceResult<Appointment>> {
  const contextResult = await getAdminAppointmentContext(input.appointmentId);
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, appointment, adminProfileId } = contextResult.data;
  if (appointment.status !== APPOINTMENT_STATUS.PENDING) {
    return {
      ok: false,
      message: "Only pending appointments can be approved.",
    };
  }

  const updateResult = await updateStatusByAdmin(
    {
      appointment,
      adminProfileId,
      nextStatus: APPOINTMENT_STATUS.APPROVED,
      adminNotes: input.adminNotes,
    },
    supabase,
  );

  if (!updateResult.ok) {
    return updateResult;
  }

  const updated = updateResult.data;
  await notifyAppointmentApproved({
    recipientProfileId: updated.patient_profile_id,
    appointmentId: updated.id,
    appointmentDate: updated.appointment_date,
    startTime: updated.start_time,
  });

  return {
    ok: true,
    data: mapAppointment(updated),
  };
}

export async function rescheduleAppointmentByAdmin(
  input: RescheduleAppointmentInput,
): Promise<AppointmentServiceResult<Appointment>> {
  const contextResult = await getAdminAppointmentContext(input.appointmentId);
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, appointment, adminProfileId } = contextResult.data;

  if (
    appointment.status === APPOINTMENT_STATUS.CANCELLED ||
    appointment.status === APPOINTMENT_STATUS.COMPLETED ||
    appointment.status === APPOINTMENT_STATUS.REJECTED
  ) {
    return {
      ok: false,
      message: "This appointment cannot be rescheduled.",
    };
  }

  const timeResult = await buildDateTimeFromInput(supabase, {
    slotId: input.slotId,
    scheduledAt: input.scheduledAt,
    serviceId: appointment.service_id,
  });

  if (!timeResult.ok) {
    return timeResult;
  }

  const { slot, appointmentDate, startTime, endTime } = timeResult.data;
  const oldSlotId = appointment.slot_id;
  const newSlotId = slot?.id ?? null;

  if (newSlotId && newSlotId !== oldSlotId) {
    const reserved = await adjustSlotBookedCount(supabase, newSlotId, 1);
    if (!reserved) {
      return {
        ok: false,
        message: "Unable to reserve selected slot.",
      };
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({
      slot_id: newSlotId,
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
      status: APPOINTMENT_STATUS.RESCHEDULED,
      admin_notes: input.adminNotes ?? appointment.admin_notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointment.id)
    .select("*")
    .single();

  if (error || !data) {
    if (newSlotId && newSlotId !== oldSlotId) {
      await adjustSlotBookedCount(supabase, newSlotId, -1);
    }

    return {
      ok: false,
      message: "Unable to reschedule appointment.",
    };
  }

  if (oldSlotId && oldSlotId !== newSlotId) {
    await adjustSlotBookedCount(supabase, oldSlotId, -1);
  }

  await createAppointmentStatusLog(supabase, {
    appointmentId: data.id,
    oldStatus: appointment.status,
    newStatus: data.status,
    changedBy: adminProfileId,
    notes: input.adminNotes,
  });

  await notifyAppointmentRescheduled({
    recipientProfileId: data.patient_profile_id,
    appointmentId: data.id,
    appointmentDate: data.appointment_date,
    startTime: data.start_time,
  });

  return {
    ok: true,
    data: mapAppointment(data),
  };
}

export async function cancelAppointmentByAdmin(
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentServiceResult<Appointment>> {
  const contextResult = await getAdminAppointmentContext(input.appointmentId);
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, appointment, adminProfileId } = contextResult.data;

  if (
    appointment.status === APPOINTMENT_STATUS.CANCELLED ||
    appointment.status === APPOINTMENT_STATUS.COMPLETED
  ) {
    return {
      ok: false,
      message: "This appointment cannot be cancelled.",
    };
  }

  const updateResult = await updateStatusByAdmin(
    {
      appointment,
      adminProfileId,
      nextStatus: APPOINTMENT_STATUS.CANCELLED,
      adminNotes: input.adminNotes,
      cancellationReason: input.adminNotes,
    },
    supabase,
  );

  if (!updateResult.ok) {
    return updateResult;
  }

  const updated = updateResult.data;

  if (appointment.slot_id) {
    await adjustSlotBookedCount(supabase, appointment.slot_id, -1);
  }

  await notifyAppointmentCancelled({
    recipientProfileId: updated.patient_profile_id,
    appointmentId: updated.id,
    appointmentDate: updated.appointment_date,
    startTime: updated.start_time,
  });

  return {
    ok: true,
    data: mapAppointment(updated),
  };
}

export async function completeAppointmentByAdmin(
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentServiceResult<Appointment>> {
  const contextResult = await getAdminAppointmentContext(input.appointmentId);
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, appointment, adminProfileId } = contextResult.data;

  if (
    appointment.status !== APPOINTMENT_STATUS.APPROVED &&
    appointment.status !== APPOINTMENT_STATUS.RESCHEDULED
  ) {
    return {
      ok: false,
      message: "Only approved or rescheduled appointments can be completed.",
    };
  }

  const updateResult = await updateStatusByAdmin(
    {
      appointment,
      adminProfileId,
      nextStatus: APPOINTMENT_STATUS.COMPLETED,
      adminNotes: input.adminNotes,
    },
    supabase,
  );

  if (!updateResult.ok) {
    return updateResult;
  }

  const updated = updateResult.data;
  await notifyAppointmentCompleted({
    recipientProfileId: updated.patient_profile_id,
    appointmentId: updated.id,
    appointmentDate: updated.appointment_date,
    startTime: updated.start_time,
  });

  return {
    ok: true,
    data: mapAppointment(updated),
  };
}
