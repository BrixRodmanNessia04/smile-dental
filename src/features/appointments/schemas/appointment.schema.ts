import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/;

const cleanOptionalText = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const createAppointmentSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(120, "Name must be at most 120 characters."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(160, "Email must be at most 160 characters."),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number is required.")
      .max(20, "Phone number is too long.")
      .regex(PHONE_REGEX, "Enter a valid phone number."),
    serviceId: z
      .string()
      .trim()
      .min(2, "Select a valid service.")
      .max(120, "Select a valid service.")
      .regex(/^[a-z0-9-]+$/i, "Select a valid service."),
    slotId: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value)),
    appointmentDate: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value))
      .refine((value) => !value || DATE_REGEX.test(value), {
        message: "Select a valid date.",
      }),
    appointmentTime: z
      .string()
      .trim()
      .optional()
      .transform((value) => cleanOptionalText(value))
      .refine((value) => !value || TIME_REGEX.test(value), {
        message: "Select a valid time.",
      }),
    reason: z
      .string()
      .transform((value) => cleanOptionalText(value))
      .refine((value) => !value || value.length <= 700, {
        message: "Notes must not exceed 700 characters.",
      })
      .optional(),
  })
  .superRefine((input, ctx) => {
    if (!input.slotId && !input.appointmentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a slot or provide a preferred date.",
        path: ["appointmentDate"],
      });
    }

    if (!input.slotId && !input.appointmentTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a slot or provide a preferred time.",
        path: ["appointmentTime"],
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
