import { z } from "zod";

const cleanOptionalText = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const grantPointsSchema = z.object({
  patientProfileId: z.string().uuid("Invalid patient profile id."),
  points: z.coerce.number().int().min(1, "Points must be at least 1.").max(100000),
  description: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 300, {
      message: "Description must not exceed 300 characters.",
    })
    .optional(),
  appointmentId: z
    .string()
    .trim()
    .optional()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || z.string().uuid().safeParse(value).success, {
      message: "Invalid appointment id.",
    })
    .optional(),
});

export const redeemPointsSchema = z.object({
  points: z.coerce.number().int().min(1, "Points must be at least 1.").max(100000),
  description: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 300, {
      message: "Description must not exceed 300 characters.",
    })
    .optional(),
});

export type GrantPointsInput = z.infer<typeof grantPointsSchema>;
export type RedeemPointsInput = z.infer<typeof redeemPointsSchema>;
