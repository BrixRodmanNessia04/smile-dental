"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateAppointmentStatusSchema } from "../schemas/appointment.schema";
import { approveAppointmentByAdmin } from "../services/appointment.service";

export async function approveAppointment(formData: FormData) {
  const parsed = updateAppointmentStatusSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    adminNotes: formData.get("adminNotes") ?? "",
  });

  const fallbackId = String(formData.get("appointmentId") ?? "");

  if (!parsed.success) {
    redirect(`/admin/appointments/${fallbackId}`);
  }

  const result = await approveAppointmentByAdmin(parsed.data);
  if (!result.ok) {
    redirect(`/admin/appointments/${parsed.data.appointmentId}`);
  }

  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${result.data.id}`);
  revalidatePath("/patient/appointments");
  revalidatePath(`/patient/appointments/${result.data.id}`);

  redirect(`/admin/appointments/${result.data.id}`);
}
