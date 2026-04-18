import type { User } from "@supabase/supabase-js";

import { isUserRole, type UserRole } from "@/lib/constants/roles";

const getRoleFromUnknown = (value: unknown): UserRole | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return isUserRole(normalized) ? normalized : null;
};

export function getUserMetadataRole(user: User): UserRole | null {
  return (
    getRoleFromUnknown(user.app_metadata?.role) ??
    getRoleFromUnknown(user.user_metadata?.role)
  );
}

export function resolveUserRole(profileRole: unknown, user: User): UserRole | null {
  return getRoleFromUnknown(profileRole) ?? getUserMetadataRole(user);
}
