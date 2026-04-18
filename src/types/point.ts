export type PointTransactionType = "earn" | "redeem" | "adjustment";

export type PatientPointsRow = {
  id: string;
  patient_profile_id: string;
  total_points: number;
  updated_at: string;
};

export type PointTransactionRow = {
  id: string;
  patient_profile_id: string;
  appointment_id: string | null;
  type: PointTransactionType;
  points: number;
  description: string | null;
  created_by: string | null;
  created_at: string;
};

export type PatientPoints = PatientPointsRow;
export type PointTransaction = PointTransactionRow;
