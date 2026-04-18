import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const cleanOptionalText = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const createAppointmentSchema = z
  .object({
    serviceId: z.string().uuid("Invalid service."),
    slotId: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value)),
    scheduledAt: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value)),
    reason: z
      .string()
      .transform((value) => cleanOptionalText(value))
      .refine((value) => !value || value.length <= 1000, {
        message: "Reason must not exceed 1000 characters.",
      })
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (!input.slotId && !input.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a slot or provide a preferred date and time.",
        path: ["scheduledAt"],
      });
    }
  });

export const appointmentIdSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment id."),
});

export const rescheduleAppointmentSchema = appointmentIdSchema
  .extend({
    slotId: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value)),
    scheduledAt: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value)),
    adminNotes: z
      .string()
      .transform((value) => cleanOptionalText(value))
      .refine((value) => !value || value.length <= 1000, {
        message: "Admin notes must not exceed 1000 characters.",
      })
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (!input.slotId && !input.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a slot or provide a date and time.",
        path: ["scheduledAt"],
      });
    }
  });

export const updateAppointmentStatusSchema = appointmentIdSchema.extend({
  adminNotes: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 1000, {
      message: "Admin notes must not exceed 1000 characters.",
    })
    .optional(),
});

export const createAppointmentSlotSchema = z.object({
  slotDate: z.string().regex(DATE_REGEX, "Invalid slot date."),
  startTime: z.string().regex(TIME_REGEX, "Invalid start time."),
  endTime: z.string().regex(TIME_REGEX, "Invalid end time."),
  maxCapacity: z.coerce.number().int().min(1).max(20),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type CreateAppointmentSlotInput = z.infer<typeof createAppointmentSlotSchema>;
