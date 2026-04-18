"use client";

import { useActionState } from "react";

import { redeemPoints } from "@/features/points/actions/redeemPoints";
import {
  INITIAL_POINTS_FORM_STATE,
  type PointsFormState,
} from "@/features/points/types";

export default function RedeemPointsPlaceholderForm() {
  const [state, formAction, isPending] = useActionState<PointsFormState, FormData>(
    redeemPoints,
    INITIAL_POINTS_FORM_STATE,
  );

  return (
    <form action={formAction} className="space-y-3">
      {state.message ? (
        <p
          className={
            state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="redeem-points">
            Points to redeem
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            id="redeem-points"
            min={1}
            name="points"
            required
            step={1}
            type="number"
          />
          {state.errors?.points?.[0] ? (
            <p className="text-sm text-red-600">{state.errors.points[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="redeem-description">
            Notes (optional)
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            id="redeem-description"
            name="description"
            type="text"
          />
        </div>
      </div>

      <button
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Submitting..." : "Redeem (placeholder)"}
      </button>
    </form>
  );
}
