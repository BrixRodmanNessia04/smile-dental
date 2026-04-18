import { env } from "@/env";
import { resolveUserRole } from "@/lib/auth/roles";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { USER_ROLES } from "@/lib/constants/roles";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { SignInInput } from "../schemas/signIn.schema";
import type { SignUpInput } from "../schemas/signUp.schema";
import { provisionPatientProfile, syncPatientProfile } from "./profile.service";

export type AuthServiceResult =
  | {
      ok: true;
      requiresEmailVerification?: boolean;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };

const getPatientOAuthCallbackUrl = () => {
  const callbackUrl = new URL(AUTH_ROUTES.OAUTH_CALLBACK, env.NEXT_PUBLIC_SITE_URL);
  callbackUrl.searchParams.set("next", AUTH_ROUTES.PATIENT_HOME);
  return callbackUrl.toString();
};

const getErrorMessage = (errorMessage: string | null | undefined, fallback: string) => {
  const normalized = errorMessage?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

const isEmailRateLimitError = (errorMessage: string | null | undefined) =>
  /email.*rate limit|rate limit.*email|rate limit exceeded/i.test(errorMessage ?? "");

const isAlreadyRegisteredError = (errorMessage: string | null | undefined) =>
  /already registered|already exists|user already/i.test(errorMessage ?? "");

async function registerPatientWithAdminFallback(input: SignUpInput): Promise<AuthServiceResult> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ok: false,
      message: "Email sending is currently rate-limited. Please wait a minute and try again.",
    };
  }

  const adminSupabase = createAdminSupabaseClient();
  const { data: createdUser, error: createUserError } = await adminSupabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName,
      role: USER_ROLES.PATIENT,
    },
    app_metadata: {
      role: USER_ROLES.PATIENT,
    },
  });

  if (createUserError) {
    if (isAlreadyRegisteredError(createUserError.message)) {
      return {
        ok: false,
        message: "This email is already registered. Please sign in instead.",
      };
    }

    return {
      ok: false,
      message: getErrorMessage(createUserError.message, "Unable to create your account."),
    };
  }

  if (!createdUser.user) {
    return {
      ok: false,
      message: "Unable to create your account.",
    };
  }

  const provisionResult = await provisionPatientProfile(adminSupabase, {
    authUserId: createdUser.user.id,
    email: input.email,
    fullName: input.fullName,
  });

  if (!provisionResult.ok) {
    return {
      ok: false,
      message: provisionResult.message,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signInError || !signInData.user) {
    return {
      ok: true,
      requiresEmailVerification: true,
      message: "Account created. Please sign in with your new credentials.",
    };
  }

  return { ok: true };
}

export async function signInPatientWithEmailPassword(
  input: SignInInput,
): Promise<AuthServiceResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return {
      ok: false,
      message: getErrorMessage(error.message, "Invalid email or password."),
    };
  }

  if (!data.user) {
    return {
      ok: false,
      message: "Unable to sign you in right now.",
    };
  }

  const syncResult = await syncPatientProfile(supabase, data.user);
  if (!syncResult.ok) {
    await supabase.auth.signOut();
    return syncResult;
  }

  return { ok: true };
}

export async function signInAdminWithEmailPassword(
  input: SignInInput,
): Promise<AuthServiceResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return {
      ok: false,
      message: getErrorMessage(error.message, "Invalid email or password."),
    };
  }

  if (!data.user) {
    return {
      ok: false,
      message: "Unable to sign you in right now.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "Unable to verify your admin role.",
    };
  }

  const role = resolveUserRole(profile?.role, data.user);
  if (role !== USER_ROLES.ADMIN) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "This account is not allowed to access admin routes.",
    };
  }

  return { ok: true };
}

export async function registerPatientWithEmailPassword(
  input: SignUpInput,
): Promise<AuthServiceResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: getPatientOAuthCallbackUrl(),
      data: {
        full_name: input.fullName,
        role: USER_ROLES.PATIENT,
      },
    },
  });

  if (error) {
    if (isEmailRateLimitError(error.message)) {
      return registerPatientWithAdminFallback(input);
    }

    if (isAlreadyRegisteredError(error.message)) {
      return {
        ok: false,
        message: "This email is already registered. Please sign in instead.",
      };
    }

    return {
      ok: false,
      message: getErrorMessage(error.message, "Unable to create your account."),
    };
  }

  if (!data.user) {
    return {
      ok: false,
      message: "Unable to create your account.",
    };
  }

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminSupabase = createAdminSupabaseClient();
    const provisionResult = await provisionPatientProfile(adminSupabase, {
      authUserId: data.user.id,
      email: input.email,
      fullName: input.fullName,
    });

    if (!provisionResult.ok) {
      return {
        ok: false,
        message: provisionResult.message,
      };
    }

    if (data.session) {
      return { ok: true };
    }
  } else if (data.session) {
    const syncResult = await syncPatientProfile(supabase, data.user);
    if (!syncResult.ok) {
      await supabase.auth.signOut();
      return syncResult;
    }

    return { ok: true };
  }

  return {
    ok: true,
    requiresEmailVerification: true,
    message: "Registration successful. Check your email to verify your account.",
  };
}
