import type { NotificationsPayload } from "@/features/notifications/types";

import NotificationBellClient from "@/components/notifications/NotificationBell";

type NotificationBellProps = {
  initialPayload?: NotificationsPayload | null;
};

export default function NotificationBell({ initialPayload }: NotificationBellProps) {
  return <NotificationBellClient initialPayload={initialPayload} />;
}
