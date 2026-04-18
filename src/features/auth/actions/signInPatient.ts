"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/lib/constants/routes";

import { signInSchema } from "../schemas/signIn.schema";
import type { AuthActionState } from "../types";
import { signInPatientWithEmailPassword } from "../services/auth.service";
import { syncPatientProfile } from "../services/profile.service";

export async function signInPatient(
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

  const result = await signInPatientWithEmailPassword(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  redirect(AUTH_ROUTES.PATIENT_HOME);
}

export async function finalizePatientSignIn(): Promise<AuthActionState> {
  const supabase = await createServerSupabaseClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[auth] finalize_patient_signin_user_error", {
        message: authError?.message ?? "Missing signed-in user",
      });

      return {
        status: "error",
        message: "Unable to complete sign-in right now. Please try again.",
      };
    }

    const syncResult = await syncPatientProfile(supabase, user);
    if (!syncResult.ok) {
      await supabase.auth.signOut();
      console.error("[auth] finalize_patient_signin_profile_sync_error", {
        message: syncResult.message,
      });

      return {
        status: "error",
        message: syncResult.message,
      };
    }

    return {
      status: "success",
    };
  } catch (error) {
    await supabase.auth.signOut();
    console.error("[auth] finalize_patient_signin_exception", {
      error,
    });

    return {
      status: "error",
      message: "Unable to complete sign-in right now. Please try again.",
    };
  }
}
