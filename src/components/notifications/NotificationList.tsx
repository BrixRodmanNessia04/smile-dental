"use client";

import type { Notification } from "@/types/notification";

import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
  emptyMessage?: string;
};

export default function NotificationList({
  notifications,
  onMarkRead,
  emptyMessage = "No notifications yet.",
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}
