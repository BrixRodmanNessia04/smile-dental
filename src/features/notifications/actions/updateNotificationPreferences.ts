"use server";

import { updateNotificationPreferencesSchema } from "../schemas/notification.schema";
import { updateMyNotificationPreferences } from "../services/notification.service";
import type { NotificationActionResult } from "../types";

export async function updateNotificationPreferences(
  payload: unknown,
): Promise<NotificationActionResult> {
  const parsed = updateNotificationPreferencesSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid preferences payload.",
    };
  }

  return updateMyNotificationPreferences(parsed.data);
}
