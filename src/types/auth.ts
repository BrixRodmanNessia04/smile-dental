import type { UserRole } from "@/lib/constants/roles";

export type AuthProvider = "password" | "google" | "facebook";

export type AuthSessionUser = {
  auth_user_id: string;
  profile_id: string;
  role: UserRole;
  email: string;
  is_active: boolean;
};

export type AuthResult =
  | {
      ok: true;
      user: AuthSessionUser;
    }
  | {
      ok: false;
      message: string;
    };
