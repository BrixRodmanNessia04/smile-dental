"use server";

import { revalidatePath } from "next/cache";

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
  revalidatePath("/book-appointment");

  return {
    status: "success",
    message: "Appointment request sent. Our team will confirm your schedule shortly.",
    appointmentId: result.data.id,
  };
}
