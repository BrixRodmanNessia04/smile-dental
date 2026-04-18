import type { Notification, NotificationPreference } from "@/types/notification";

export type NotificationsPayload = {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference;
};

export type NotificationActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };
