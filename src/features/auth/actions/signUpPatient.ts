"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/constants/routes";

import { signUpSchema } from "../schemas/signUp.schema";
import type { AuthActionState } from "../types";
import { registerPatientWithEmailPassword } from "../services/auth.service";

export async function signUpPatient(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await registerPatientWithEmailPassword(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  if (result.requiresEmailVerification) {
    return {
      status: "success",
      message: result.message,
    };
  }

  redirect(AUTH_ROUTES.PATIENT_HOME);
}
