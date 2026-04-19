import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type {
  CreateServiceInput,
  ToggleServiceInput,
  UpdateServiceInput,
} from "../schemas/service.schema";
import type { AdminServiceItem, AppointmentServiceResult } from "../types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

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

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

async function ensureAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false as const,
      message: "You are not authorized to perform this action.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile || resolveUserRole(profile.role, user) !== USER_ROLES.ADMIN) {
    return {
      ok: false as const,
      message: "You are not allowed to manage services.",
    };
  }

  return {
    ok: true as const,
    data: { supabase },
  };
}

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  baseName: string,
): Promise<AppointmentServiceResult<string>> {
  const base = toSlug(baseName) || "service";

  const { data, error } = await supabase
    .from("services")
    .select("slug")
    .ilike("slug", `${base}%`)
    .limit(100);

  if (error) {
    return {
      ok: false,
      message: "Unable to validate service slug.",
    };
  }

  const existing = new Set((data ?? []).map((row) => row.slug));
  if (!existing.has(base)) {
    return { ok: true, data: base };
  }

  let counter = 2;
  while (counter <= 200) {
    const candidate = `${base}-${counter}`;
    if (!existing.has(candidate)) {
      return { ok: true, data: candidate };
    }
    counter += 1;
  }

  return {
    ok: false,
    message: "Unable to generate a unique service slug.",
  };
}

export async function createServiceByAdmin(
  input: CreateServiceInput,
): Promise<AppointmentServiceResult<AdminServiceItem>> {
  const adminResult = await ensureAdmin();
  if (!adminResult.ok) {
    return adminResult;
  }

  const { supabase } = adminResult.data;
  const slugResult = await buildUniqueSlug(supabase, input.name);
  if (!slugResult.ok) {
    return slugResult;
  }
  const { data, error } = await supabase
    .from("services")
    .insert({
      name: input.name,
      slug: slugResult.data,
      description: input.description ?? null,
      duration_minutes: input.durationMinutes,
      base_price: input.basePrice ?? null,
      is_active: true,
    })
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to create service.",
    };
  }

  return {
    ok: true,
    data: mapAdminService(data),
  };
}

export async function updateServiceByAdmin(
  input: UpdateServiceInput,
): Promise<AppointmentServiceResult<AdminServiceItem>> {
  const adminResult = await ensureAdmin();
  if (!adminResult.ok) {
    return adminResult;
  }

  const { supabase } = adminResult.data;
  const { data, error } = await supabase
    .from("services")
    .update({
      name: input.name,
      description: input.description ?? null,
      duration_minutes: input.durationMinutes,
      base_price: input.basePrice ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.serviceId)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to update service.",
    };
  }

  return {
    ok: true,
    data: mapAdminService(data),
  };
}

export async function toggleServiceActiveByAdmin(
  input: ToggleServiceInput,
): Promise<AppointmentServiceResult<null>> {
  const adminResult = await ensureAdmin();
  if (!adminResult.ok) {
    return adminResult;
  }

  const { supabase } = adminResult.data;
  const { error } = await supabase
    .from("services")
    .update({
      is_active: input.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.serviceId);

  if (error) {
    return {
      ok: false,
      message: "Unable to update service status.",
    };
  }

  return {
    ok: true,
    data: null,
  };
}
