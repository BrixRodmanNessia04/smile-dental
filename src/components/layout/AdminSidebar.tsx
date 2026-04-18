"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAdmin } from "@/features/auth/actions/signOut";
import { ADMIN_ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

import Card, { CardContent } from "@/components/ui/card";

const NAV_ITEMS = [
  { href: ADMIN_ROUTES.DASHBOARD, label: "Dashboard" },
  { href: ADMIN_ROUTES.INSIGHTS, label: "Insights" },
  { href: ADMIN_ROUTES.APPOINTMENTS, label: "Appointments" },
  { href: ADMIN_ROUTES.PATIENTS, label: "Patients" },
  { href: ADMIN_ROUTES.POSTS, label: "Posts" },
  { href: ADMIN_ROUTES.SETTINGS, label: "Settings" },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Admin workspace
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">Clinic operations</p>
        </div>

        <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-3">
          <form action={signOutAdmin}>
            <button
              className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm font-medium text-foreground transition hover:bg-muted"
              type="submit"
            >
              Logout
            </button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
