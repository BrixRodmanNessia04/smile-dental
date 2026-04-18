export const NOTIFICATION_TYPE = {
  GENERAL: "general",
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_APPROVED: "appointment_approved",
  APPOINTMENT_RESCHEDULED: "appointment_rescheduled",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_COMPLETED: "appointment_completed",
  POINTS_EARNED: "points_earned",
  POINTS_REDEEMED: "points_redeemed",
  POST_PUBLISHED: "post_published",
  MARKETING_UPDATE: "marketing_update",
  SYSTEM: "system",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export function isNotificationType(value: unknown): value is NotificationType {
  return Object.values(NOTIFICATION_TYPE).includes(value as NotificationType);
}
