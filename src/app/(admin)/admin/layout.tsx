import Link from "next/link";

import AdminSidebar from "@/components/layout/AdminSidebar";
import PageShell from "@/components/layout/PageShell";
import NotificationBell from "@/components/shared/NotificationBell";
import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";

export default async function SegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const result = await getMyNotificationsPayload();

  return (
    <PageShell
      header={
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Admin workspace
            </p>
            <Link className="text-sm font-semibold text-foreground hover:text-primary" href="/admin/dashboard">
              Clinic operations dashboard
            </Link>
          </div>
          <NotificationBell initialPayload={result.ok ? result.data : null} />
        </div>
      }
      sidebar={<AdminSidebar />}
    >
      {children}
    </PageShell>
  );
}
