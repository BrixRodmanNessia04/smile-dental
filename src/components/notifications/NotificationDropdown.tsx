"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { NotificationsPayload } from "@/features/notifications/types";
import { useNotifications } from "@/hooks/useNotifications";

import NotificationBellShell from "./NotificationBellShell";
import NotificationList from "./NotificationList";

type NotificationDropdownProps = {
  initialPayload?: NotificationsPayload | null;
  notificationsPagePath: string;
};

export default function NotificationDropdown({
  initialPayload,
  notificationsPagePath,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    errorMessage,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications({ initialPayload });

  const latestNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      void refresh();
    }
  };

  return (
    <div className="relative">
      <NotificationBellShell onClick={toggleOpen} unreadCount={unreadCount} />

      {isOpen ? (
        <div className="absolute right-0 z-40 mt-2 w-[min(92vw,26rem)] rounded-2xl border border-[hsl(var(--border-strong))] bg-[hsl(var(--card))] p-4 shadow-[0_18px_50px_-26px_hsl(var(--shadow))]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Recent notifications</p>
            <button
              className="text-xs font-medium text-[hsl(var(--muted-foreground))] underline decoration-[hsl(var(--border-strong))] underline-offset-4 hover:text-[hsl(var(--foreground))] disabled:opacity-50"
              disabled={unreadCount === 0 || isLoading}
              onClick={() => {
                void markAllAsRead();
              }}
              type="button"
            >
              Mark all read
            </button>
          </div>

          {errorMessage ? (
            <p className="mb-3 rounded-lg border border-[hsl(var(--destructive-soft))] bg-[hsl(var(--destructive-soft))] p-2 text-xs text-[hsl(var(--destructive))]">
              {errorMessage}
            </p>
          ) : null}

          <NotificationList
            emptyMessage="No recent notifications."
            notifications={latestNotifications}
            onMarkRead={markAsRead}
          />

          <Link
            className="mt-3 inline-block text-xs font-medium text-[hsl(var(--primary-strong))] hover:underline"
            href={notificationsPagePath}
          >
            View all notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
}
