"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { rescheduleAppointmentSchema } from "../schemas/appointment.schema";
import { rescheduleAppointmentByAdmin } from "../services/appointment.service";

export async function rescheduleAppointment(formData: FormData) {
  const parsed = rescheduleAppointmentSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    slotId: formData.get("slotId") ?? "",
    scheduledAt: formData.get("scheduledAt") ?? "",
    adminNotes: formData.get("adminNotes") ?? "",
  });

  const fallbackId = String(formData.get("appointmentId") ?? "");

  if (!parsed.success) {
    redirect(`/admin/appointments/${fallbackId}`);
  }

  const result = await rescheduleAppointmentByAdmin(parsed.data);
  if (!result.ok) {
    redirect(`/admin/appointments/${parsed.data.appointmentId}`);
  }

  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${result.data.id}`);
  revalidatePath("/patient/appointments");
  revalidatePath(`/patient/appointments/${result.data.id}`);

  redirect(`/admin/appointments/${result.data.id}`);
}
