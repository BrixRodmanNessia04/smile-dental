import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { AuthServiceResult } from "./auth.service";
import { syncPatientProfile } from "./profile.service";

const getErrorMessage = (errorMessage: string | null | undefined, fallback: string) => {
  const normalized = errorMessage?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

export async function completePatientOAuthSignIn(code: string): Promise<AuthServiceResult> {
  const supabase = await createServerSupabaseClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return {
      ok: false,
      message: getErrorMessage(exchangeError.message, "Unable to complete OAuth sign-in."),
    };
  }

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return {
      ok: false,
      message: getErrorMessage(getUserError?.message, "Unable to load your account."),
    };
  }

  const syncResult = await syncPatientProfile(supabase, user);
  if (!syncResult.ok) {
    await supabase.auth.signOut();
    return syncResult;
  }

  return { ok: true };
}
