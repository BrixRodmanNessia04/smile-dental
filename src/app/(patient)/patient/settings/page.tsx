import Link from "next/link";

import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/lib/constants/features";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your patient account preferences and security options.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Quick links for your patient account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/patient/profile"
            >
              Open profile
            </Link>
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/patient/appointments"
            >
              Manage appointments
            </Link>
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/patient/points"
            >
              View points
            </Link>
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/forgot-password"
            >
              Reset password
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Delivery preferences for updates from One Dental.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border border-border bg-card-strong p-3 text-sm text-muted-foreground">
              {FEATURES.NOTIFICATIONS_ENABLED
                ? "Notification preferences are available from your notifications page."
                : "Notification settings are temporarily hidden while we stabilize notification reliability."}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
