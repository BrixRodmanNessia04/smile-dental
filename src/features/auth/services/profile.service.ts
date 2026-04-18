import type { SupabaseClient, User } from "@supabase/supabase-js";

import { ensurePatientRole, type GuardResult } from "@/lib/auth/guards";
import { resolveUserRole } from "@/lib/auth/roles";
import { USER_ROLES } from "@/lib/constants/roles";
import type { Database } from "@/types/database";

export type ProfileSyncResult = GuardResult;

const getMetadataString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const getProfileName = (user: User): string | null => {
  return getMetadataString(user.user_metadata?.full_name) ?? getMetadataString(user.user_metadata?.name);
};

const getProfileAvatarUrl = (user: User): string | null => {
  return getMetadataString(user.user_metadata?.avatar_url) ?? getMetadataString(user.user_metadata?.picture);
};

const getNameParts = (fullName: string): { firstName: string; lastName: string } => {
  const parts = fullName
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return { firstName: "Patient", lastName: "User" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "User" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

type ProfileUpsertInput = {
  authUserId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
};

async function upsertPatientProfile(
  supabase: SupabaseClient<Database>,
  input: ProfileUpsertInput,
): Promise<ProfileSyncResult> {
  const nameParts = getNameParts(input.fullName);

  const { error: upsertError } = await supabase.from("profiles").upsert(
    {
      auth_user_id: input.authUserId,
      email: input.email,
      first_name: nameParts.firstName,
      last_name: nameParts.lastName,
      avatar_url: input.avatarUrl,
      role: USER_ROLES.PATIENT,
    },
    { onConflict: "auth_user_id" },
  );

  if (upsertError) {
    return {
      ok: false,
      message: "Unable to sync your patient profile.",
    };
  }

  return { ok: true };
}

export async function syncPatientProfile(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<ProfileSyncResult> {
  const email = getMetadataString(user.email);

  if (!email) {
    return {
      ok: false,
      message: "This account is missing an email address.",
    };
  }

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existingProfileError) {
    return {
      ok: false,
      message: "Unable to verify your patient profile.",
    };
  }

  const roleCheck = ensurePatientRole(resolveUserRole(existingProfile?.role, user));
  if (!roleCheck.ok) {
    return roleCheck;
  }

  const metadataName = getProfileName(user);
  const fullName =
    metadataName ??
    `${existingProfile?.first_name || email.split("@")[0] || "Patient"} ${existingProfile?.last_name || "User"}`;

  return upsertPatientProfile(supabase, {
    authUserId: user.id,
    email,
    fullName,
    avatarUrl: getProfileAvatarUrl(user),
  });
}

export async function provisionPatientProfile(
  supabase: SupabaseClient<Database>,
  input: {
    authUserId: string;
    email: string;
    fullName: string;
  },
): Promise<ProfileSyncResult> {
  return upsertPatientProfile(supabase, {
    authUserId: input.authUserId,
    email: input.email,
    fullName: input.fullName,
    avatarUrl: null,
  });
}
