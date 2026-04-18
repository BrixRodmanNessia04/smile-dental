import { USER_ROLES, type UserRole } from "@/lib/constants/roles";

export type GuardResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
    };

export function ensurePatientRole(role: UserRole | null): GuardResult {
  if (role === null || role === USER_ROLES.PATIENT) {
    return { ok: true };
  }

  return {
    ok: false,
    message: "This account is not allowed to use the patient authentication flow.",
  };
}
