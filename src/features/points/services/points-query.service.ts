import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type {
  AdminPointsPayload,
  PatientPointsPayload,
  PointPatientOption,
  PointsServiceResult,
  PointsSummary,
  PointsTransaction,
} from "../types";

type PointTransactionRow = Database["public"]["Tables"]["point_transactions"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type NameMap = Map<string, { fullName: string; email: string }>;

const mapSummary = (
  patientProfileId: string,
  row: Database["public"]["Tables"]["patient_points"]["Row"] | null,
): PointsSummary => ({
  patientProfileId,
  totalPoints: row?.total_points ?? 0,
  updatedAt: row?.updated_at ?? new Date(0).toISOString(),
});

const buildFullName = (profile: Pick<ProfileRow, "first_name" | "last_name" | "email">) => {
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  return fullName.length > 0 ? fullName : profile.email;
};

const mapTransaction = (row: PointTransactionRow, nameMap: NameMap): PointsTransaction => {
  const patient = nameMap.get(row.patient_profile_id);

  return {
    id: row.id,
    patientProfileId: row.patient_profile_id,
    patientName: patient?.fullName ?? null,
    appointmentId: row.appointment_id,
    type: row.type,
    points: row.points,
    description: row.description,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
};

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
      profileId: profile.id,
      role: resolveUserRole(profile.role, user),
    },
  };
}

async function getPatientNameMap(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  patientProfileIds: string[],
): Promise<NameMap> {
  if (patientProfileIds.length === 0) {
    return new Map();
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email")
    .in("id", patientProfileIds);

  return new Map(
    (data ?? []).map((profile) => [
      profile.id,
      {
        fullName: buildFullName(profile),
        email: profile.email,
      },
    ]),
  );
}

export async function getPatientPointsPayload(
  limit = 50,
): Promise<PointsServiceResult<PatientPointsPayload>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, profileId, role } = actorResult.data;
  if (role !== USER_ROLES.PATIENT) {
    return {
      ok: false,
      message: "You are not allowed to view patient points.",
    };
  }

  const [{ data: pointsRow, error: pointsError }, { data: transactions, error: txError }] =
    await Promise.all([
      supabase
        .from("patient_points")
        .select("*")
        .eq("patient_profile_id", profileId)
        .maybeSingle(),
      supabase
        .from("point_transactions")
        .select("*")
        .eq("patient_profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

  if (pointsError || txError) {
    return {
      ok: false,
      message: "Unable to load points data.",
    };
  }

  const nameMap = await getPatientNameMap(supabase, [profileId]);

  return {
    ok: true,
    data: {
      summary: mapSummary(profileId, pointsRow),
      transactions: (transactions ?? []).map((row) => mapTransaction(row, nameMap)),
    },
  };
}

export async function getAdminPointsPayload(
  limit = 100,
): Promise<PointsServiceResult<AdminPointsPayload>> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false,
      message: "You are not allowed to view admin points.",
    };
  }

  const [{ data: patients, error: patientsError }, { data: transactions, error: txError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .eq("role", USER_ROLES.PATIENT)
        .eq("is_active", true)
        .order("first_name", { ascending: true })
        .order("last_name", { ascending: true }),
      supabase
        .from("point_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

  if (patientsError || txError) {
    return {
      ok: false,
      message: "Unable to load points data.",
    };
  }

  const patientOptions: PointPatientOption[] = (patients ?? []).map((patient) => ({
    profileId: patient.id,
    fullName: buildFullName(patient),
    email: patient.email,
  }));

  const nameMap = new Map(
    patientOptions.map((patient) => [
      patient.profileId,
      {
        fullName: patient.fullName,
        email: patient.email,
      },
    ]),
  );

  return {
    ok: true,
    data: {
      patients: patientOptions,
      transactions: (transactions ?? []).map((row) => mapTransaction(row, nameMap)),
    },
  };
}
