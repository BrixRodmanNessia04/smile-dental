import NotificationsPageClient from "@/components/notifications/NotificationsPageClient";
import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";

export default async function Page() {
  const result = await getMyNotificationsPayload();

  return (
    <NotificationsPageClient
      heading="Patient notifications"
      initialErrorMessage={result.ok ? undefined : result.message}
      initialPayload={result.ok ? result.data : null}
    />
  );
}
