import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAdminAppointments } from "@/features/appointments/services/appointment-query.service";

const formatDateTime = (date: string, start: string, end: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(`${date}T${start}`)) + ` - ${end.slice(0, 5)}`;

export default async function Page() {
  const appointmentsResult = await listAdminAppointments();

  return (
    <main className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">All appointments</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage appointment requests without layout overflow.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/appointments/schedule">Manage slots</Link>
          </Button>
        </CardContent>
      </Card>

      {!appointmentsResult.ok ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive">
          {appointmentsResult.message}
        </p>
      ) : appointmentsResult.data.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          No appointments found.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appointment list</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsResult.data.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="max-w-[16rem] break-words font-medium">
                      {appointment.serviceName ?? appointment.serviceId}
                    </TableCell>
                    <TableCell className="min-w-[15rem] text-muted-foreground">
                      {formatDateTime(
                        appointment.appointmentDate,
                        appointment.startTime,
                        appointment.endTime,
                      )}
                    </TableCell>
                    <TableCell className="max-w-[14rem] break-all text-muted-foreground">
                      {appointment.patientProfileId}
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={appointment.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/appointments/${appointment.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
