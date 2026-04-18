"use server";

import { redeemPointsSchema } from "../schemas/points.schema";
import { redeemPointsPlaceholderByPatient } from "../services/points.service";
import type { PointsFormState } from "../types";

export async function redeemPoints(
  _previousState: PointsFormState,
  formData: FormData,
): Promise<PointsFormState> {
  const parsed = redeemPointsSchema.safeParse({
    points: formData.get("points"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await redeemPointsPlaceholderByPatient(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  return {
    status: "success",
    message: result.message,
  };
}
