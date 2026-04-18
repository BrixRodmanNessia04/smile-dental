import Link from "next/link";

import AdminSidebar from "@/components/layout/AdminSidebar";
import PageShell from "@/components/layout/PageShell";

export default function SegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PageShell
      header={
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Admin workspace
            </p>
            <Link className="text-sm font-semibold text-foreground hover:text-primary" href="/admin/dashboard">
              Clinic operations dashboard
            </Link>
          </div>
        </div>
      }
      sidebar={<AdminSidebar />}
    >
      {children}
    </PageShell>
  );
}
