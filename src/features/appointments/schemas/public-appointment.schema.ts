import { z } from "zod";

import { getStaticAppointmentServices } from "@/lib/constants/services";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/;

const staticServiceIds = new Set(
  getStaticAppointmentServices().map((service) => service.id),
);

export const publicAppointmentRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(120, "Full name must be at most 120 characters."),
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
  serviceIds: z
    .array(z.string().trim().min(1))
    .transform((value) => Array.from(new Set(value)))
    .refine((value) => value.length > 0, {
      message: "Select at least one service.",
    })
    .refine((value) => value.every((item) => staticServiceIds.has(item)), {
      message: "Select valid services.",
    }),
  preferredDate: z
    .string()
    .trim()
    .regex(DATE_REGEX, "Select a valid preferred date."),
  preferredTime: z
    .string()
    .trim()
    .regex(TIME_REGEX, "Select a valid preferred time."),
  notes: z
    .string()
    .trim()
    .max(700, "Notes must not exceed 700 characters.")
    .optional()
    .transform((value) => value || undefined),
});

export type PublicAppointmentRequestInput = z.infer<
  typeof publicAppointmentRequestSchema
>;
