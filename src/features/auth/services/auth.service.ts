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

const AUTH_NETWORK_FAILURE_MESSAGE =
  "Unable to reach the sign-in service right now. Please try again in a moment.";
const NETWORK_SIGN_IN_MAX_ATTEMPTS = 2;
const NETWORK_SIGN_IN_RETRY_DELAY_MS = 250;

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type SignInWithPasswordResult = Awaited<
  ReturnType<ServerSupabaseClient["auth"]["signInWithPassword"]>
>;

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

const getEmailDomain = (email: string) => {
  const [, domain] = email.split("@");
  return domain || "unknown";
};

const getErrorCode = (error: unknown): string | null => {
  if (!error || typeof error !== "object") {
    return null;
  }

  if ("code" in error && typeof error.code === "string") {
    return error.code;
  }

  if ("cause" in error && error.cause && typeof error.cause === "object" && "code" in error.cause) {
    const causeCode = error.cause.code;
    return typeof causeCode === "string" ? causeCode : null;
  }

  return null;
};

const getErrorMessageFromUnknown = (error: unknown): string | null => {
  if (!error || typeof error !== "object") {
    return null;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  if ("cause" in error && error.cause && typeof error.cause === "object" && "message" in error.cause) {
    const causeMessage = error.cause.message;
    return typeof causeMessage === "string" ? causeMessage : null;
  }

  return null;
};

const isConnectTimeoutError = (error: unknown) => {
  const code = getErrorCode(error);
  if (code?.toUpperCase() === "UND_ERR_CONNECT_TIMEOUT") {
    return true;
  }

  const message = getErrorMessageFromUnknown(error)?.toLowerCase() ?? "";
  return message.includes("connect timeout") || message.includes("fetch failed");
};

const getFriendlySignInErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (isConnectTimeoutError(error)) {
    return AUTH_NETWORK_FAILURE_MESSAGE;
  }

  const message = getErrorMessageFromUnknown(error);
  return getErrorMessage(message, fallback);
};

const logAuthFailure = (input: {
  flow: string;
  email: string;
  error: unknown;
}) => {
  const payload = {
    flow: input.flow,
    emailDomain: getEmailDomain(input.email),
    code: getErrorCode(input.error),
    message: getErrorMessageFromUnknown(input.error),
  };

  if (isConnectTimeoutError(input.error)) {
    console.warn("[auth] retryable network failure", payload);
    return;
  }

  console.error("[auth] failure", {
    ...payload,
    error: input.error,
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function signInWithPasswordWithRetry(
  supabase: ServerSupabaseClient,
  input: SignInInput,
): Promise<SignInWithPasswordResult> {
  for (let attempt = 1; attempt <= NETWORK_SIGN_IN_MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (
        !result.error ||
        !isConnectTimeoutError(result.error) ||
        attempt === NETWORK_SIGN_IN_MAX_ATTEMPTS
      ) {
        return result;
      }
    } catch (error) {
      if (!isConnectTimeoutError(error) || attempt === NETWORK_SIGN_IN_MAX_ATTEMPTS) {
        throw error;
      }
    }

    await sleep(NETWORK_SIGN_IN_RETRY_DELAY_MS * attempt);
  }

  throw new Error("Sign-in retries exhausted unexpectedly.");
}

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
  let signInData: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"] | null =
    null;
  let signInError: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"] | null =
    null;
  try {
    const signInResult = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    signInData = signInResult.data;
    signInError = signInResult.error;
  } catch (error) {
    logAuthFailure({
      flow: "register_patient_admin_fallback_signin_exception",
      email: input.email,
      error,
    });
  }

  if (signInError || !signInData?.user) {
    if (signInError) {
      logAuthFailure({
        flow: "register_patient_admin_fallback_signin_error",
        email: input.email,
        error: signInError,
      });
    }

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

  let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"];
  let error: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"];
  try {
    const result = await signInWithPasswordWithRetry(supabase, input);
    data = result.data;
    error = result.error;
  } catch (authError) {
    logAuthFailure({
      flow: "patient_signin_exception",
      email: input.email,
      error: authError,
    });

    return {
      ok: false,
      message: getFriendlySignInErrorMessage(authError, "Unable to sign you in right now."),
    };
  }

  if (error) {
    logAuthFailure({
      flow: "patient_signin_error",
      email: input.email,
      error,
    });

    return {
      ok: false,
      message: getFriendlySignInErrorMessage(error, "Invalid email or password."),
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

  let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"];
  let error: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"];
  try {
    const result = await signInWithPasswordWithRetry(supabase, input);
    data = result.data;
    error = result.error;
  } catch (authError) {
    logAuthFailure({
      flow: "admin_signin_exception",
      email: input.email,
      error: authError,
    });

    return {
      ok: false,
      message: getFriendlySignInErrorMessage(authError, "Unable to sign you in right now."),
    };
  }

  if (error) {
    logAuthFailure({
      flow: "admin_signin_error",
      email: input.email,
      error,
    });

    return {
      ok: false,
      message: getFriendlySignInErrorMessage(error, "Invalid email or password."),
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
