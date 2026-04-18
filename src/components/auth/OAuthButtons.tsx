"use client";

import { useState, useTransition } from "react";

import { AUTH_ROUTES } from "@/lib/constants/routes";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type OAuthProvider = "google" | "facebook";

const OAUTH_PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "Google",
  facebook: "Facebook",
};

const OAUTH_PROVIDERS: OAuthProvider[] = ["google", "facebook"];

const getOAuthRedirectUrl = () => {
  const callbackUrl = new URL(AUTH_ROUTES.OAUTH_CALLBACK, window.location.origin);
  callbackUrl.searchParams.set("next", AUTH_ROUTES.PATIENT_HOME);
  return callbackUrl.toString();
};

export default function OAuthButtons() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const signInWithProvider = (provider: OAuthProvider) => {
    startTransition(async () => {
      setErrorMessage(null);

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getOAuthRedirectUrl(),
        },
      });

      if (error) {
        setErrorMessage(error.message || "Unable to start OAuth sign-in.");
      }
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Or continue with</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OAUTH_PROVIDERS.map((provider) => (
          <button
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            disabled={isPending}
            key={provider}
            onClick={() => signInWithProvider(provider)}
            type="button"
          >
            Continue with {OAUTH_PROVIDER_LABELS[provider]}
          </button>
        ))}
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
