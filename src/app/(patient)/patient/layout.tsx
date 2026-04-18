import Link from "next/link";

import PageShell from "@/components/layout/PageShell";
import PatientSidebar from "@/components/layout/PatientSidebar";
import { FEATURES } from "@/lib/constants/features";
import NotificationBell from "@/components/shared/NotificationBell";
import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";

export default async function SegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const notificationsResult = FEATURES.NOTIFICATIONS_ENABLED
    ? await getMyNotificationsPayload()
    : null;

  return (
    <PageShell
      header={
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Patient portal
            </p>
            <Link className="text-sm font-semibold text-foreground hover:text-primary" href="/patient">
              Personal care dashboard
            </Link>
          </div>
          {FEATURES.NOTIFICATIONS_ENABLED ? (
            <NotificationBell initialPayload={notificationsResult?.ok ? notificationsResult.data : null} />
          ) : null}
        </div>
      }
      sidebar={<PatientSidebar />}
    >
      {children}
    </PageShell>
  );
}
