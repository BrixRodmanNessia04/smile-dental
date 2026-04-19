import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type {
  AdminServiceItem,
  Appointment,
  AppointmentServiceOption,
  AppointmentServiceResult,
  AppointmentSlotOption,
} from "../types";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type SlotRow = Database["public"]["Tables"]["appointment_slots"]["Row"];

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

const mapService = (row: ServiceRow): AppointmentServiceOption => ({
  id: row.id,
  name: row.name,
  durationMinutes: row.duration_minutes,
  description: row.description,
  basePrice: row.base_price,
});

const mapAdminService = (row: ServiceRow): AdminServiceItem => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  durationMinutes: row.duration_minutes,
  basePrice: row.base_price,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSlot = (row: SlotRow): AppointmentSlotOption => ({
  id: row.id,
  slotDate: row.slot_date,
  startTime: row.start_time,
  endTime: row.end_time,
  maxCapacity: row.max_capacity,
  bookedCount: row.booked_count,
  isActive: row.is_active,
});

async function getActorContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false as const,
      message: "You are not authorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false as const,
      message: "Unable to validate your account role.",
    };
  }

  return {
    ok: true as const,
    data: {
      supabase,
      user,
      profileId: profile.id,
      role: resolveUserRole(profile.role, user),
    },
  };
}

async function getServiceNameMap(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
): Promise<Map<string, string>> {
  const { data } = await supabase.from("services").select("id, name");
  return new Map((data ?? []).map((service) => [service.id, service.name]));
}

export async function listActiveServices(): Promise<AppointmentServiceResult<AppointmentServiceOption[]>> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return {
      ok: false,
      message: "Unable to load services.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map(mapService),
  };
}

export async function listAdminServices(): Promise<AppointmentServiceResult<AdminServiceItem[]>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false,
      message: "You are not allowed to view services.",
    };
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    return {
      ok: false,
      message: "Unable to load services.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map(mapAdminService),
  };
}

export async function listAvailableSlots(
  limit = 30,
): Promise<AppointmentServiceResult<AppointmentSlotOption[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("is_active", true)
    .gte("slot_date", new Date().toISOString().slice(0, 10))
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    return {
      ok: false,
      message: "Unable to load appointment slots.",
    };
  }

  const available = (data ?? []).filter((slot) => slot.booked_count < slot.max_capacity);

  return {
    ok: true,
    data: available.map(mapSlot),
  };
}

export async function listPatientAppointments(): Promise<AppointmentServiceResult<Appointment[]>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, profileId, role } = actorResult.data;
  if (role !== USER_ROLES.PATIENT) {
    return {
      ok: false,
      message: "You are not allowed to view patient appointments.",
    };
  }

  const [{ data, error }, serviceMap] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("patient_profile_id", profileId)
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true }),
    getServiceNameMap(supabase),
  ]);

  if (error) {
    return {
      ok: false,
      message: "Unable to load appointments.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map((row) => mapAppointment(row, serviceMap.get(row.service_id) ?? null)),
  };
}

export async function getPatientAppointmentDetail(
  appointmentId: string,
): Promise<AppointmentServiceResult<Appointment>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, profileId, role } = actorResult.data;
  if (role !== USER_ROLES.PATIENT) {
    return {
      ok: false,
      message: "You are not allowed to view patient appointments.",
    };
  }

  const [{ data, error }, serviceMap] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .eq("patient_profile_id", profileId)
      .maybeSingle(),
    getServiceNameMap(supabase),
  ]);

  if (error || !data) {
    return {
      ok: false,
      message: "Appointment not found.",
    };
  }

  return {
    ok: true,
    data: mapAppointment(data, serviceMap.get(data.service_id) ?? null),
  };
}

export async function listAdminAppointments(): Promise<AppointmentServiceResult<Appointment[]>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false,
      message: "You are not allowed to view admin appointments.",
    };
  }

  const [{ data, error }, serviceMap] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true }),
    getServiceNameMap(supabase),
  ]);

  if (error) {
    return {
      ok: false,
      message: "Unable to load appointments.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map((row) => mapAppointment(row, serviceMap.get(row.service_id) ?? null)),
  };
}

export async function getAdminAppointmentDetail(
  appointmentId: string,
): Promise<AppointmentServiceResult<Appointment>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false,
      message: "You are not allowed to view admin appointments.",
    };
  }

  const [{ data, error }, serviceMap] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .maybeSingle(),
    getServiceNameMap(supabase),
  ]);

  if (error || !data) {
    return {
      ok: false,
      message: "Appointment not found.",
    };
  }

  return {
    ok: true,
    data: mapAppointment(data, serviceMap.get(data.service_id) ?? null),
  };
}

export async function listAdminAppointmentSlots(): Promise<
  AppointmentServiceResult<AppointmentSlotOption[]>
> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false,
      message: "You are not allowed to view appointment slots.",
    };
  }

  const { data, error } = await supabase
    .from("appointment_slots")
    .select("*")
    .order("slot_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(100);

  if (error) {
    return {
      ok: false,
      message: "Unable to load appointment slots.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map(mapSlot),
  };
}
