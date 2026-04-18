"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AUTH_ROUTES } from "@/lib/constants/routes";

import { signUpPatient } from "@/features/auth/actions/signUpPatient";
import {
  INITIAL_AUTH_ACTION_STATE,
  type AuthActionState,
} from "@/features/auth/types";

import PasswordField from "./PasswordField";

export default function PatientRegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signUpPatient,
    INITIAL_AUTH_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <p className={state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"}>
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
          Full name
        </label>
        <input
          autoComplete="name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          id="fullName"
          name="fullName"
          required
          type="text"
        />
        {state.errors?.fullName?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.fullName[0]}</p>
        ) : null}
      </div>

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
        {state.errors?.email?.[0] ? <p className="text-sm text-red-600">{state.errors.email[0]}</p> : null}
      </div>

      <PasswordField
        autoComplete="new-password"
        error={state.errors?.password?.[0]}
        id="password"
        label="Password"
        name="password"
        required
      />

      <PasswordField
        autoComplete="new-password"
        error={state.errors?.confirmPassword?.[0]}
        id="confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        required
      />

      <button
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating account..." : "Create patient account"}
      </button>

      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900 underline" href={AUTH_ROUTES.PATIENT_LOGIN}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
