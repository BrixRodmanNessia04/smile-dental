"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/constants/routes";

import { signInSchema } from "../schemas/signIn.schema";
import type { AuthActionState } from "../types";
import { signInAdminWithEmailPassword } from "../services/auth.service";

export async function signInAdmin(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await signInAdminWithEmailPassword(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  redirect(AUTH_ROUTES.ADMIN_DASHBOARD);
}
