"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PATIENT_ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

import Card, { CardContent } from "@/components/ui/card";

const NAV_ITEMS = [
  { href: PATIENT_ROUTES.DASHBOARD, label: "Dashboard" },
  { href: PATIENT_ROUTES.APPOINTMENTS, label: "Appointments" },
  { href: PATIENT_ROUTES.POINTS, label: "Points" },
  { href: PATIENT_ROUTES.NOTIFICATIONS, label: "Notifications" },
  { href: PATIENT_ROUTES.PROFILE, label: "Profile" },
  { href: PATIENT_ROUTES.SETTINGS, label: "Settings" },
] as const;

export default function PatientSidebar() {
  const pathname = usePathname();

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Patient portal
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">My account</p>
        </div>

        <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === PATIENT_ROUTES.DASHBOARD
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
      </CardContent>
    </Card>
  );
}
