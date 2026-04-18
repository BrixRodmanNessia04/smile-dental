"use server";

import { markNotificationReadSchema } from "../schemas/notification.schema";
import { markNotificationAsRead } from "../services/notification.service";
import type { NotificationActionResult } from "../types";

export async function markNotificationRead(
  payload: unknown,
): Promise<NotificationActionResult> {
  const parsed = markNotificationReadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid notification id.",
    };
  }

  return markNotificationAsRead(parsed.data.notificationId);
}
