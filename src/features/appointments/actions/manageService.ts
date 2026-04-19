"use server";

import { revalidatePath } from "next/cache";

import {
  createServiceSchema,
  toggleServiceSchema,
  updateServiceSchema,
} from "../schemas/service.schema";
import {
  createServiceByAdmin,
  toggleServiceActiveByAdmin,
  updateServiceByAdmin,
} from "../services/service-admin.service";

export type ServiceFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: {
    serviceId?: string[];
    name?: string[];
    description?: string[];
    durationMinutes?: string[];
    basePrice?: string[];
    isActive?: string[];
  };
};

export const INITIAL_SERVICE_FORM_STATE: ServiceFormState = {
  status: "idle",
};

function revalidateServiceViews() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/book-appointment");
  revalidatePath("/admin/services");
  revalidatePath("/admin/dashboard");
}

export async function createServiceAction(
  _previousState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const parsed = createServiceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    durationMinutes: formData.get("durationMinutes"),
    basePrice: formData.get("basePrice") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await createServiceByAdmin(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidateServiceViews();

  return {
    status: "success",
    message: `Service \"${result.data.name}\" created successfully.`,
  };
}

export async function updateServiceAction(
  _previousState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const parsed = updateServiceSchema.safeParse({
    serviceId: formData.get("serviceId"),
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    durationMinutes: formData.get("durationMinutes"),
    basePrice: formData.get("basePrice") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await updateServiceByAdmin(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidateServiceViews();

  return {
    status: "success",
    message: `Service \"${result.data.name}\" updated successfully.`,
  };
}

export async function toggleServiceActiveAction(formData: FormData): Promise<void> {
  const parsed = toggleServiceSchema.safeParse({
    serviceId: formData.get("serviceId"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return;
  }

  await toggleServiceActiveByAdmin(parsed.data);
  revalidateServiceViews();
}
