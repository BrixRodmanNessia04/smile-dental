"use server";

import { revalidatePath } from "next/cache";

import { ADMIN_ROUTES, PATIENT_ROUTES } from "@/lib/constants/routes";

import { grantPointsSchema } from "../schemas/points.schema";
import { grantPointsByAdmin } from "../services/points.service";
import type { PointsFormState } from "../types";

export async function grantPoints(
  _previousState: PointsFormState,
  formData: FormData,
): Promise<PointsFormState> {
  const parsed = grantPointsSchema.safeParse({
    patientProfileId: formData.get("patientProfileId"),
    points: formData.get("points"),
    description: formData.get("description") ?? "",
    appointmentId: formData.get("appointmentId") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await grantPointsByAdmin(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidatePath(ADMIN_ROUTES.POINTS);
  revalidatePath(PATIENT_ROUTES.POINTS);

  return {
    status: "success",
    message: `Granted ${Math.abs(result.data.transaction.points)} points successfully.`,
  };
}
