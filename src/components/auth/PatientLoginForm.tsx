"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { finalizePatientSignIn } from "@/features/auth/actions/signInPatient";
import { signInSchema } from "@/features/auth/schemas/signIn.schema";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

import type { AuthFieldErrors } from "@/features/auth/types";

import PasswordField from "./PasswordField";

const isConnectTimeoutError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCause = "cause" in error ? error.cause : null;
  if (maybeCause && typeof maybeCause === "object" && "code" in maybeCause) {
    return String(maybeCause.code).toUpperCase() === "UND_ERR_CONNECT_TIMEOUT";
  }

  return false;
};

export default function PatientLoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const oauthError = searchParams.get("error");

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setErrorMessage(null);
      setFieldErrors({});

      const parsed = signInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (!parsed.success) {
        setFieldErrors(parsed.error.flatten().fieldErrors);
        setErrorMessage("Please fix the validation errors.");
        return;
      }

      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

        if (error) {
          setErrorMessage(error.message || "Invalid email or password.");
          return;
        }

        if (!data.user) {
          setErrorMessage("Unable to sign you in right now.");
          return;
        }

        const syncResult = await finalizePatientSignIn();
        if (syncResult.status === "error") {
          await supabase.auth.signOut();
          setErrorMessage(syncResult.message || "Unable to sign you in right now.");
          return;
        }

        router.replace(AUTH_ROUTES.PATIENT_HOME);
        router.refresh();
      } catch (error) {
        console.error("[auth] patient_login_browser_exception", {
          error,
        });

        if (isConnectTimeoutError(error)) {
          setErrorMessage(
            "Unable to reach the sign-in service right now. Please try again in a moment.",
          );
          return;
        }

        setErrorMessage("Unable to sign you in right now. Please try again.");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      {oauthError ? <p className="text-sm text-red-600">{oauthError}</p> : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          id="email"
          name="email"
          required
          type="email"
        />
        {fieldErrors.email?.[0] ? <p className="text-sm text-red-600">{fieldErrors.email[0]}</p> : null}
      </div>

      <PasswordField
        autoComplete="current-password"
        error={fieldErrors.password?.[0]}
        id="password"
        label="Password"
        name="password"
        required
      />

      <button
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm text-slate-600">
        Need an account?{" "}
        <Link className="font-medium text-slate-900 underline" href={AUTH_ROUTES.PATIENT_REGISTER}>
          Register as patient
        </Link>
      </p>
    </form>
  );
}
