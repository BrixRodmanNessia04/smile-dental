import Link from "next/link";

import NotificationsPageClient from "@/components/notifications/NotificationsPageClient";
import { FEATURES } from "@/lib/constants/features";
import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";

export default async function Page() {
  if (!FEATURES.NOTIFICATIONS_ENABLED) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="mt-2 rounded-lg border border-border bg-card-strong p-4 text-sm text-muted-foreground">
          Notifications are temporarily hidden while we fix notification errors. You can continue
          managing appointments, points, profile, and settings.
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            href="/patient"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const result = await getMyNotificationsPayload();

  return (
    <NotificationsPageClient
      heading="Patient notifications"
      initialErrorMessage={result.ok ? undefined : result.message}
      initialPayload={result.ok ? result.data : null}
    />
  );
}
