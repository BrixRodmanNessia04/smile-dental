"use client";

import { usePathname } from "next/navigation";

import type { NotificationsPayload } from "@/features/notifications/types";

import NotificationDropdown from "./NotificationDropdown";

type NotificationBellProps = {
  initialPayload?: NotificationsPayload | null;
};

export default function NotificationBell({ initialPayload }: NotificationBellProps) {
  const pathname = usePathname();
  const notificationsPagePath = pathname.startsWith("/admin")
    ? "/admin/notifications"
    : "/patient/notifications";

  return (
    <NotificationDropdown
      initialPayload={initialPayload}
      notificationsPagePath={notificationsPagePath}
    />
  );
}
