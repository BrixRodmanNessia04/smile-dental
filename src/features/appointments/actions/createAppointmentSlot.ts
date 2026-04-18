"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAppointmentSlotSchema } from "../schemas/appointment.schema";
import { createAppointmentSlotByAdmin } from "../services/appointment.service";

export async function createAppointmentSlot(formData: FormData) {
  const parsed = createAppointmentSlotSchema.safeParse({
    slotDate: formData.get("slotDate"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    maxCapacity: formData.get("maxCapacity"),
  });

  if (!parsed.success) {
    redirect("/admin/appointments/schedule");
  }

  const result = await createAppointmentSlotByAdmin(parsed.data);
  if (!result.ok) {
    redirect("/admin/appointments/schedule");
  }

  revalidatePath("/admin/appointments/schedule");
  revalidatePath("/patient/appointments/new");

  redirect("/admin/appointments/schedule");
}
