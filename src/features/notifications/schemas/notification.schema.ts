import { z } from "zod";

import { isNotificationType, type NotificationType } from "@/lib/constants/notification-type";

export const createNotificationSchema = z.object({
  recipientProfileId: z.string().uuid("Invalid recipient profile id."),
  type: z.custom<NotificationType>((value) => isNotificationType(value), "Invalid notification type."),
  title: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1200),
  entityType: z.string().trim().max(100).optional(),
  entityId: z.string().uuid("Invalid entity id.").optional(),
});

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid("Invalid notification id."),
});

export const updateNotificationPreferencesSchema = z.object({
  inAppEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  appointmentUpdatesEnabled: z.boolean(),
  pointsUpdatesEnabled: z.boolean(),
  marketingUpdatesEnabled: z.boolean(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
