import Link from "next/link";

import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Admin Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operational settings and quick access links for clinic admins.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>Core areas you can manage today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/admin/appointments"
            >
              Appointments
            </Link>
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/admin/patients"
            >
              Patients
            </Link>
            <Link
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
              href="/admin/posts"
            >
              Posts
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System notes</CardTitle>
            <CardDescription>Temporary platform controls.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border border-border bg-card-strong p-3 text-sm text-muted-foreground">
              Non-priority modules are currently hidden while marketing and appointment booking
              flows are being optimized.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
