import type { PointTransactionType } from "@/types/point";

export type PointsSummary = {
  patientProfileId: string;
  totalPoints: number;
  updatedAt: string;
};

export type PointsTransaction = {
  id: string;
  patientProfileId: string;
  patientName: string | null;
  appointmentId: string | null;
  type: PointTransactionType;
  points: number;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type PointPatientOption = {
  profileId: string;
  fullName: string;
  email: string;
};

export type PatientPointsPayload = {
  summary: PointsSummary;
  transactions: PointsTransaction[];
};

export type AdminPointsPayload = {
  patients: PointPatientOption[];
  transactions: PointsTransaction[];
};

export type PointsFieldErrors = {
  patientProfileId?: string[];
  points?: string[];
  description?: string[];
  appointmentId?: string[];
};

export type PointsFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: PointsFieldErrors;
};

export const INITIAL_POINTS_FORM_STATE: PointsFormState = {
  status: "idle",
};

export type PointsServiceResult<T> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };
