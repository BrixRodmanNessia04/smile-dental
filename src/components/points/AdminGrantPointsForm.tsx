"use client";

import { useActionState } from "react";

import { grantPoints } from "@/features/points/actions/grantPoints";
import {
  INITIAL_POINTS_FORM_STATE,
  type PointPatientOption,
  type PointsFormState,
} from "@/features/points/types";

type AdminGrantPointsFormProps = {
  patients: PointPatientOption[];
};

export default function AdminGrantPointsForm({ patients }: AdminGrantPointsFormProps) {
  const [state, formAction, isPending] = useActionState<PointsFormState, FormData>(
    grantPoints,
    INITIAL_POINTS_FORM_STATE,
  );

  if (patients.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        No active patients are available to receive points yet.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <p
          className={
            state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="patientProfileId">
          Patient
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue=""
          id="patientProfileId"
          name="patientProfileId"
          required
        >
          <option disabled value="">
            Select patient
          </option>
          {patients.map((patient) => (
            <option key={patient.profileId} value={patient.profileId}>
              {patient.fullName} ({patient.email})
            </option>
          ))}
        </select>
        {state.errors?.patientProfileId?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.patientProfileId[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="points">
          Points to grant
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          id="points"
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
        <label className="block text-sm font-medium text-slate-700" htmlFor="description">
          Description (optional)
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          id="description"
          name="description"
          rows={3}
        />
        {state.errors?.description?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.description[0]}</p>
        ) : null}
      </div>

      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Granting..." : "Grant points"}
      </button>
    </form>
  );
}
