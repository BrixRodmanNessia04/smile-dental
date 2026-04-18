"use server";

import { createNotificationSchema } from "../schemas/notification.schema";
import { createInAppNotification } from "../services/notification.service";
import type { NotificationActionResult } from "../types";

export async function createNotification(
  payload: unknown,
): Promise<NotificationActionResult> {
  const parsed = createNotificationSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid notification payload.",
    };
  }

  return createInAppNotification(parsed.data);
}
