"use client";

import type { Notification } from "@/types/notification";

type NotificationItemProps = {
  notification: Notification;
  onMarkRead: (notificationId: string) => void;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  return (
    <article
      className={`rounded-lg border p-3 ${
        notification.isRead
          ? "border-slate-200 bg-white"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
          <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
          <p className="mt-2 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</p>
        </div>
        {!notification.isRead ? (
          <button
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
            onClick={() => onMarkRead(notification.id)}
            type="button"
          >
            Mark read
          </button>
        ) : null}
      </div>
    </article>
  );
}
