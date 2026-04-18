"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAppointmentSchema,
} from "../schemas/appointment.schema";
import { createPatientAppointment } from "../services/appointment.service";
import type { AppointmentFormState } from "../types";

export async function createAppointment(
  _previousState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const parsed = createAppointmentSchema.safeParse({
    serviceId: formData.get("serviceId"),
    slotId: formData.get("slotId") ?? "",
    scheduledAt: formData.get("scheduledAt") ?? "",
    reason: formData.get("reason") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await createPatientAppointment(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidatePath("/patient/appointments");
  redirect(`/patient/appointments/${result.data.id}`);
}
