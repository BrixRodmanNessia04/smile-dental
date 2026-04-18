import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import PostStatusBadge from "@/components/posts/PostStatusBadge";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import Card, { CardContent, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAdminAppointments } from "@/features/appointments/services/appointment-query.service";
import { getAdminPointsPayload } from "@/features/points/services/points-query.service";
import { listAdminPosts } from "@/features/posts/services/post-query.service";

const formatDateTime = (date: string, time: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(`${date}T${time}`));

export default async function Page() {
  const [appointmentsResult, pointsResult, postsResult] = await Promise.all([
    listAdminAppointments(),
    getAdminPointsPayload(),
    listAdminPosts(),
  ]);

  const appointments = appointmentsResult.ok ? appointmentsResult.data : [];
  const patients = pointsResult.ok ? pointsResult.data.patients : [];
  const transactions = pointsResult.ok ? pointsResult.data.transactions : [];
  const posts = postsResult.ok ? postsResult.data : [];

  const pointsDistributed = transactions.reduce(
    (sum, transaction) => sum + (transaction.points > 0 ? transaction.points : 0),
    0,
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const recentPatients = patients.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="flex flex-wrap items-end justify-between gap-4 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Operational overview of appointments, patients, and content activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              href="/admin/appointments"
            >
              View Appointments
            </Link>
            <Link
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
              href="/admin/posts/new"
            >
              New Post
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          hint="All appointment records"
          label="Total Appointments"
          value={appointments.length}
        />
        <StatCard hint="Active patient profiles" label="Total Patients" value={patients.length} />
        <StatCard
          hint="Points awarded to patients"
          label="Points Distributed"
          value={pointsDistributed}
        />
      </div>

      <Card>
        <CardHeader>
          <SectionHeader
            action={
              <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href="/admin/appointments">
                View all
              </Link>
            }
            description="Most recent appointment entries."
            title="Recent Appointments"
          />
        </CardHeader>
        <CardContent>
          {!appointmentsResult.ok ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
              {appointmentsResult.message}
            </p>
          ) : recentAppointments.length === 0 ? (
            <EmptyState
              actionHref="/admin/appointments"
              actionLabel="Open Appointments"
              description="No appointments have been created yet."
              title="No appointments"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.serviceName ?? appointment.serviceId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(appointment.appointmentDate, appointment.startTime)}
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={appointment.status} />
                    </TableCell>
                    <TableCell>
                      <Link
                        className="text-sm font-semibold text-primary transition hover:text-primary-strong"
                        href={`/admin/appointments/${appointment.id}`}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <SectionHeader
              action={
                <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href="/admin/patients">
                  View all
                </Link>
              }
              description="Recently active patient profiles."
              title="Recent Patients"
            />
          </CardHeader>
          <CardContent>
            {!pointsResult.ok ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
                {pointsResult.message}
              </p>
            ) : recentPatients.length === 0 ? (
              <EmptyState
                actionHref="/admin/patients"
                actionLabel="Open Patients"
                description="No patient profiles found."
                title="No patients yet"
              />
            ) : (
              <div className="space-y-2">
                {recentPatients.map((patient) => (
                  <article className="rounded-lg border border-border bg-card-strong p-3" key={patient.profileId}>
                    <p className="text-sm font-semibold text-foreground">{patient.fullName}</p>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader
              action={
                <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href="/admin/posts">
                  Manage posts
                </Link>
              }
              description="Latest clinic announcements and content updates."
              title="Recent Posts"
            />
          </CardHeader>
          <CardContent>
            {!postsResult.ok ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
                {postsResult.message}
              </p>
            ) : recentPosts.length === 0 ? (
              <EmptyState
                actionHref="/admin/posts/new"
                actionLabel="Create Post"
                description="Create your first post to populate this list."
                title="No posts yet"
              />
            ) : (
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <article className="rounded-lg border border-border bg-card-strong p-3" key={post.id}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{post.title}</p>
                      <PostStatusBadge status={post.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">/{post.slug}</p>
                    <Link
                      className="mt-2 inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong"
                      href={`/admin/posts/${post.id}`}
                    >
                      Open post
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
