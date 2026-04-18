import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/env";
import { resolveUserRole } from "@/lib/auth/roles";
import { AUTH_ROUTES } from "@/lib/constants/routes";
import { USER_ROLES } from "@/lib/constants/roles";
import type { Database } from "@/types/database";

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const isRouteWithin = (basePath: string) =>
    pathname === basePath || pathname.startsWith(`${basePath}/`);

  const isAdminLoginRoute = pathname === AUTH_ROUTES.ADMIN_LOGIN;
  const isAdminRoute = isRouteWithin(AUTH_ROUTES.ADMIN_BASE) && !isAdminLoginRoute;
  const isPatientRoute = isRouteWithin(AUTH_ROUTES.PATIENT_HOME);
  const isPatientAuthRoute =
    pathname === AUTH_ROUTES.PATIENT_LOGIN ||
    pathname === AUTH_ROUTES.PATIENT_REGISTER;

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminRoute && !isAdminLoginRoute && !isPatientRoute && !isPatientAuthRoute) {
    return response;
  }

  if (!user) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.ADMIN_LOGIN, request.url));
    }

    if (isPatientRoute) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.PATIENT_LOGIN, request.url));
    }

    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const role = resolveUserRole(profile?.role, user);
  const isAdminUser = role === USER_ROLES.ADMIN;
  const isPatientUser = role === USER_ROLES.PATIENT;

  if (isAdminLoginRoute && isAdminUser) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.ADMIN_DASHBOARD, request.url));
  }

  if (isAdminLoginRoute && !isAdminUser) {
    const redirectPath = isPatientUser
      ? AUTH_ROUTES.PATIENT_HOME
      : AUTH_ROUTES.PATIENT_LOGIN;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isAdminRoute && !isAdminUser) {
    const redirectPath = isPatientUser
      ? AUTH_ROUTES.PATIENT_HOME
      : AUTH_ROUTES.PATIENT_LOGIN;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isPatientAuthRoute) {
    if (isAdminUser) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.ADMIN_DASHBOARD, request.url));
    }

    if (isPatientUser) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.PATIENT_HOME, request.url));
    }

    return response;
  }

  if (isPatientRoute) {
    if (isAdminUser) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.ADMIN_DASHBOARD, request.url));
    }

    if (!isPatientUser) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.PATIENT_LOGIN, request.url));
    }
  }

  return response;
}
