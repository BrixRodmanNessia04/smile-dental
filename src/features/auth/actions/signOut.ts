"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/constants/routes";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function signOutAndRedirect(destination: string) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect(destination);
}

export async function signOutPatient() {
  await signOutAndRedirect(AUTH_ROUTES.PATIENT_LOGIN);
}

export async function signOutAdmin() {
  await signOutAndRedirect(AUTH_ROUTES.ADMIN_LOGIN);
}
