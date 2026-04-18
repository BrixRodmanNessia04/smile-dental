import { NextResponse } from "next/server";

import { completePatientOAuthSignIn } from "@/features/auth/services/oauth.service";
import { sanitizeNextPath } from "@/lib/auth/redirects";
import { AUTH_ROUTES } from "@/lib/constants/routes";

const createLoginRedirect = (origin: string, errorMessage: string) => {
  const loginUrl = new URL(AUTH_ROUTES.PATIENT_LOGIN, origin);
  loginUrl.searchParams.set("error", errorMessage);
  return NextResponse.redirect(loginUrl);
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = sanitizeNextPath(
    requestUrl.searchParams.get("next"),
    AUTH_ROUTES.PATIENT_HOME,
  );

  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  if (oauthError) {
    return createLoginRedirect(requestUrl.origin, oauthError);
  }

  if (!code) {
    return createLoginRedirect(requestUrl.origin, "Missing OAuth callback code.");
  }

  const result = await completePatientOAuthSignIn(code);

  if (!result.ok) {
    return createLoginRedirect(requestUrl.origin, result.message);
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
