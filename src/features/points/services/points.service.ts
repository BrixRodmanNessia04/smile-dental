import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES, type UserRole } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { PointTransactionType } from "@/types/point";
import { notifyPointsEarned } from "@/features/notifications/services/notification.service";

import type {
  GrantPointsInput,
  RedeemPointsInput,
} from "../schemas/points.schema";
import type {
  PointsServiceResult,
  PointsSummary,
  PointsTransaction,
} from "../types";

type PointTransactionRow = Database["public"]["Tables"]["point_transactions"]["Row"];
type PatientPointsRow = Database["public"]["Tables"]["patient_points"]["Row"];
type Supabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type ActorContext = {
  supabase: Supabase;
  profileId: string;
  role: UserRole | null;
};

const MAX_RETRIES = 5;

const unauthorized = <T>(): PointsServiceResult<T> => ({
  ok: false,
  message: "You are not authorized to perform this action.",
});

const mapTransaction = (row: PointTransactionRow): PointsTransaction => ({
  id: row.id,
  patientProfileId: row.patient_profile_id,
  patientName: null,
  appointmentId: row.appointment_id,
  type: row.type,
  points: row.points,
  description: row.description,
  createdBy: row.created_by,
  createdAt: row.created_at,
});

const mapSummary = (row: PatientPointsRow): PointsSummary => ({
  patientProfileId: row.patient_profile_id,
  totalPoints: row.total_points,
  updatedAt: row.updated_at,
});

async function getActorContext(): Promise<PointsServiceResult<ActorContext>> {
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
      profileId: profile.id,
      role: resolveUserRole(profile.role, user),
    },
  };
}

async function ensurePatientProfile(
  supabase: Supabase,
  patientProfileId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientProfileId)
    .eq("role", USER_ROLES.PATIENT)
    .maybeSingle();

  return !error && Boolean(data);
}

async function ensurePointsRow(
  supabase: Supabase,
  patientProfileId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from("patient_points")
    .upsert(
      {
        patient_profile_id: patientProfileId,
        total_points: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "patient_profile_id", ignoreDuplicates: true },
    );

  return !error;
}

function normalizeTransactionPoints(type: PointTransactionType, points: number) {
  if (type === "earn") {
    return Math.abs(points);
  }

  if (type === "redeem") {
    return -Math.abs(points);
  }

  return points;
}

async function updatePatientTotalPointsSafely(
  supabase: Supabase,
  patientProfileId: string,
  delta: number,
): Promise<PointsServiceResult<PointsSummary>> {
  const prepared = await ensurePointsRow(supabase, patientProfileId);
  if (!prepared) {
    return {
      ok: false,
      message: "Unable to prepare patient points.",
    };
  }

  for (let index = 0; index < MAX_RETRIES; index += 1) {
    const { data: current, error: currentError } = await supabase
      .from("patient_points")
      .select("*")
      .eq("patient_profile_id", patientProfileId)
      .maybeSingle();

    if (currentError || !current) {
      return {
        ok: false,
        message: "Unable to load current points.",
      };
    }

    const nextTotal = current.total_points + delta;
    if (nextTotal < 0) {
      return {
        ok: false,
        message: "Insufficient points balance.",
      };
    }

    const { data: updated, error: updateError } = await supabase
      .from("patient_points")
      .update({
        total_points: nextTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .eq("total_points", current.total_points)
      .select("*")
      .maybeSingle();

    if (updateError) {
      return {
        ok: false,
        message: "Unable to update total points.",
      };
    }

    if (updated) {
      return {
        ok: true,
        data: mapSummary(updated),
      };
    }
  }

  return {
    ok: false,
    message: "Unable to update points due to a concurrent change. Please retry.",
  };
}

async function applyPointTransaction(
  supabase: Supabase,
  input: {
    patientProfileId: string;
    type: PointTransactionType;
    points: number;
    description?: string;
    appointmentId?: string;
    createdBy?: string;
  },
): Promise<
  PointsServiceResult<{
    summary: PointsSummary;
    transaction: PointsTransaction;
  }>
> {
  const normalizedPoints = normalizeTransactionPoints(input.type, input.points);

  if (!Number.isInteger(normalizedPoints) || normalizedPoints === 0) {
    return {
      ok: false,
      message: "Invalid points value.",
    };
  }

  const summaryResult = await updatePatientTotalPointsSafely(
    supabase,
    input.patientProfileId,
    normalizedPoints,
  );

  if (!summaryResult.ok) {
    return summaryResult;
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("point_transactions")
    .insert({
      patient_profile_id: input.patientProfileId,
      appointment_id: input.appointmentId ?? null,
      type: input.type,
      points: normalizedPoints,
      description: input.description ?? null,
      created_by: input.createdBy ?? null,
    })
    .select("*")
    .single();

  if (transactionError || !transaction) {
    await updatePatientTotalPointsSafely(
      supabase,
      input.patientProfileId,
      -normalizedPoints,
    );

    return {
      ok: false,
      message: "Unable to save point transaction.",
    };
  }

  return {
    ok: true,
    data: {
      summary: summaryResult.data,
      transaction: mapTransaction(transaction),
    },
  };
}

export async function grantPointsByAdmin(
  input: GrantPointsInput,
): Promise<
  PointsServiceResult<{
    summary: PointsSummary;
    transaction: PointsTransaction;
  }>
> {
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { supabase, profileId, role } = actorResult.data;
  if (role !== USER_ROLES.ADMIN) {
    return unauthorized();
  }

  const isPatient = await ensurePatientProfile(supabase, input.patientProfileId);
  if (!isPatient) {
    return {
      ok: false,
      message: "Patient profile not found.",
    };
  }

  const result = await applyPointTransaction(supabase, {
    patientProfileId: input.patientProfileId,
    type: "earn",
    points: input.points,
    description: input.description,
    appointmentId: input.appointmentId,
    createdBy: profileId,
  });

  if (!result.ok) {
    return result;
  }

  await notifyPointsEarned({
    recipientProfileId: input.patientProfileId,
    points: Math.abs(result.data.transaction.points),
    appointmentId: result.data.transaction.appointmentId,
  });

  return {
    ok: true,
    data: result.data,
  };
}

export async function redeemPointsPlaceholderByPatient(
  input: RedeemPointsInput,
): Promise<PointsServiceResult<null>> {
  void input;
  const actorResult = await getActorContext();
  if (!actorResult.ok) {
    return actorResult;
  }

  const { role } = actorResult.data;
  if (role !== USER_ROLES.PATIENT) {
    return unauthorized();
  }

  return {
    ok: true,
    data: null,
    message: "Redeem points will be available in a future update.",
  };
}
