import Link from "next/link";

import StatCard from "@/components/shared/StatCard";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listAdminAppointments } from "@/features/appointments/services/appointment-query.service";
import { listAdminPosts } from "@/features/posts/services/post-query.service";

export default async function Page() {
  const [appointmentsResult, postsResult] = await Promise.all([
    listAdminAppointments(),
    listAdminPosts(),
  ]);

  const appointments = appointmentsResult.ok ? appointmentsResult.data : [];
  const posts = postsResult.ok ? postsResult.data : [];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const publishedPosts = posts.filter((post) => post.status === "published").length;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Snapshot metrics for appointments and content performance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          hint="All appointment records"
          label="Appointments"
          value={appointmentsResult.ok ? appointments.length : "-"}
        />
        <StatCard
          hint="Awaiting admin action"
          label="Pending"
          value={appointmentsResult.ok ? pendingAppointments : "-"}
        />
        <StatCard
          hint="Clinic updates visible to patients"
          label="Published Posts"
          value={postsResult.ok ? publishedPosts : "-"}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Quick follow-up</CardTitle>
          <CardDescription>Jump to the relevant module to take action.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <Link
            className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
            href="/admin/appointments"
          >
            Review appointments
          </Link>
          <Link
            className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
            href="/admin/patients"
          >
            Open patients
          </Link>
          <Link
            className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
            href="/admin/posts"
          >
            Manage posts
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
