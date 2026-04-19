import { z } from "zod";

const trimToUndefined = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalMoney = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value === "number") {
      return value;
    }

    if (!value) {
      return undefined;
    }

    const normalized = value.toString().trim();
    if (normalized.length === 0) {
      return undefined;
    }

    return Number(normalized);
  })
  .refine((value) => value === undefined || Number.isFinite(value), {
    message: "Base price must be a valid number.",
  })
  .refine((value) => value === undefined || value >= 0, {
    message: "Base price cannot be negative.",
  });

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters.")
    .max(120, "Service name must be at most 120 characters."),
  description: z
    .string()
    .transform((value) => trimToUndefined(value))
    .refine((value) => !value || value.length <= 500, {
      message: "Description must be at most 500 characters.",
    })
    .optional(),
  durationMinutes: z.coerce.number().int().min(5).max(360),
  basePrice: optionalMoney,
});

export const updateServiceSchema = createServiceSchema.extend({
  serviceId: z.string().uuid("Invalid service id."),
});

export const toggleServiceSchema = z.object({
  serviceId: z.string().uuid("Invalid service id."),
  isActive: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .transform((value) => value === true || value === "true"),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ToggleServiceInput = z.infer<typeof toggleServiceSchema>;
