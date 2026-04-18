"use client";

import { useActionState } from "react";

import { signInAdmin } from "@/features/auth/actions/signInAdmin";
import {
  INITIAL_AUTH_ACTION_STATE,
  type AuthActionState,
} from "@/features/auth/types";

import PasswordField from "./PasswordField";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signInAdmin,
    INITIAL_AUTH_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? <p className="text-sm text-red-600">{state.message}</p> : null}

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
        autoComplete="current-password"
        error={state.errors?.password?.[0]}
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
        {isPending ? "Signing in..." : "Sign in as admin"}
      </button>
    </form>
  );
}
