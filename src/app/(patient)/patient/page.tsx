import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import SectionHeader from "@/components/shared/SectionHeader";
import StatCard from "@/components/shared/StatCard";
import { listPatientAppointments } from "@/features/appointments/services/appointment-query.service";
import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";
import { getPatientPointsPayload } from "@/features/points/services/points-query.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const formatDateTime = (date: string, time: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(`${date}T${time}`));

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

async function getPatientName() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "Patient";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return profile?.first_name || "Patient";
}

function isUpcoming(date: string, startTime: string) {
  return new Date(`${date}T${startTime}`).getTime() >= Date.now();
}

export default async function Page() {
  const [patientName, appointmentsResult, pointsResult, notificationsResult] = await Promise.all([
    getPatientName(),
    listPatientAppointments(),
    getPatientPointsPayload(),
    getMyNotificationsPayload(),
  ]);

  const upcomingAppointment = appointmentsResult.ok
    ? [...appointmentsResult.data]
        .filter((appointment) =>
          ["pending", "approved", "rescheduled"].includes(appointment.status),
        )
        .filter((appointment) => isUpcoming(appointment.appointmentDate, appointment.startTime))
        .sort(
          (a, b) =>
            new Date(`${a.appointmentDate}T${a.startTime}`).getTime() -
            new Date(`${b.appointmentDate}T${b.startTime}`).getTime(),
        )[0]
    : null;

  const notifications = notificationsResult.ok
    ? notificationsResult.data.notifications.slice(0, 4)
    : [];

  return (
    <div className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, {patientName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage appointments, points, and notifications from your One Dental dashboard.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          hint="Current reward balance"
          label="Points"
          value={pointsResult.ok ? pointsResult.data.summary.totalPoints : "-"}
        />
        <StatCard
          hint="Unread clinic updates"
          label="Unread notifications"
          value={notificationsResult.ok ? notificationsResult.data.unreadCount : "-"}
        />
        <StatCard
          hint="Total appointment records"
          label="Appointments"
          value={appointmentsResult.ok ? appointmentsResult.data.length : "-"}
        />
        <StatCard
          hint="Your next visit status"
          label="Upcoming visit"
          value={upcomingAppointment ? "Scheduled" : "None"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <SectionHeader
              description="Your nearest appointment that still needs attention."
              title="Upcoming Appointment"
            />
          </CardHeader>
          <CardContent>
            {!appointmentsResult.ok ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
                {appointmentsResult.message}
              </p>
            ) : !upcomingAppointment ? (
              <EmptyState
                actionHref="/patient/appointments/new"
                actionLabel="Book Appointment"
                description="You have no upcoming appointments. Choose a schedule that works for you."
                title="No upcoming appointment"
              />
            ) : (
              <article className="rounded-lg border border-border bg-card-strong p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {upcomingAppointment.serviceName ?? upcomingAppointment.serviceId}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDateTime(
                        upcomingAppointment.appointmentDate,
                        upcomingAppointment.startTime,
                      )}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={upcomingAppointment.status} />
                </div>

                {upcomingAppointment.reason ? (
                  <p className="mt-3 text-sm text-muted-foreground">Reason: {upcomingAppointment.reason}</p>
                ) : null}

                <Link
                  className="mt-4 inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong"
                  href={`/patient/appointments/${upcomingAppointment.id}`}
                >
                  View appointment details
                </Link>
              </article>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points Summary</CardTitle>
              <CardDescription>Track your balance and last update.</CardDescription>
            </CardHeader>
            <CardContent>
              {!pointsResult.ok ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
                  {pointsResult.message}
                </p>
              ) : (
                <div className="rounded-lg border border-border bg-card-strong p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Current balance
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-foreground">
                    {pointsResult.data.summary.totalPoints}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Updated {formatTimestamp(pointsResult.data.summary.updatedAt)}
                  </p>
                  <Link
                    className="mt-4 inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong"
                    href="/patient/points"
                  >
                    View points
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to common patient tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
                href="/patient/appointments/new"
              >
                Book Appointment
              </Link>
              <Link
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                href="/patient/points"
              >
                View Points
              </Link>
              <Link
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                href="/patient/appointments"
              >
                View Appointments
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <SectionHeader
            action={
              <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href="/patient/notifications">
                View all
              </Link>
            }
            description="Latest updates from One Dental."
            title="Notifications Preview"
          />
        </CardHeader>
        <CardContent>
          {!notificationsResult.ok ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
              {notificationsResult.message}
            </p>
          ) : notifications.length === 0 ? (
            <EmptyState
              actionHref="/patient/notifications"
              actionLabel="Open Notifications"
              description="You are all caught up. New notifications will appear here."
              title="No notifications yet"
            />
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <article className="rounded-lg border border-border bg-card-strong p-3" key={notification.id}>
                  <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
