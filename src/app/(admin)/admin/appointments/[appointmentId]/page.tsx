import Link from "next/link";

import AppointmentStatusBadge from "@/components/appointments/AppointmentStatusBadge";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { approveAppointment } from "@/features/appointments/actions/approveAppointment";
import { cancelAppointment } from "@/features/appointments/actions/cancelAppointment";
import { completeAppointment } from "@/features/appointments/actions/completeAppointment";
import { rescheduleAppointment } from "@/features/appointments/actions/rescheduleAppointment";
import {
  getAdminAppointmentDetail,
  listAvailableSlots,
} from "@/features/appointments/services/appointment-query.service";

type PageProps = {
  params: Promise<{
    appointmentId: string;
  }>;
};

const toDateTimeLocalValue = (date: string, time: string) => `${date}T${time.slice(0, 5)}`;

export default async function Page({ params }: PageProps) {
  const { appointmentId } = await params;
  const [appointmentResult, slotsResult] = await Promise.all([
    getAdminAppointmentDetail(appointmentId),
    listAvailableSlots(100),
  ]);

  return (
    <main className="space-y-5">
      <Button asChild variant="outline">
        <Link href="/admin/appointments">Back to appointments</Link>
      </Button>

      {!appointmentResult.ok ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive">
          {appointmentResult.message}
        </p>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="break-words text-xl">
                  {appointmentResult.data.serviceName ?? appointmentResult.data.serviceId}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {appointmentResult.data.appointmentDate} {appointmentResult.data.startTime}-
                  {appointmentResult.data.endTime}
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  Patient profile: {appointmentResult.data.patientProfileId}
                </p>
              </div>
              <AppointmentStatusBadge status={appointmentResult.data.status} />
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card-strong p-3">
                  <dt className="font-semibold text-foreground">Reason</dt>
                  <dd className="mt-1 break-words text-muted-foreground">
                    {appointmentResult.data.reason || "None"}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-card-strong p-3">
                  <dt className="font-semibold text-foreground">Admin notes</dt>
                  <dd className="mt-1 break-words text-muted-foreground">
                    {appointmentResult.data.adminNotes || "None"}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-card-strong p-3">
                  <dt className="font-semibold text-foreground">Cancellation reason</dt>
                  <dd className="mt-1 break-words text-muted-foreground">
                    {appointmentResult.data.cancellationReason || "None"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Approve</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={approveAppointment} className="space-y-3">
                  <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
                  <Textarea name="adminNotes" placeholder="Optional admin notes" rows={3} />
                  <Button type="submit" variant="accent">Approve appointment</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reschedule</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={rescheduleAppointment} className="space-y-3">
                  <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
                  <select
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-sm sm:text-sm"
                    defaultValue=""
                    name="slotId"
                  >
                    <option value="">No pre-defined slot</option>
                    {slotsResult.ok
                      ? slotsResult.data.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.slotDate} {slot.startTime}-{slot.endTime} ({slot.bookedCount}/
                            {slot.maxCapacity})
                          </option>
                        ))
                      : null}
                  </select>
                  <Input
                    defaultValue={toDateTimeLocalValue(
                      appointmentResult.data.appointmentDate,
                      appointmentResult.data.startTime,
                    )}
                    name="scheduledAt"
                    required
                    type="datetime-local"
                  />
                  <Textarea name="adminNotes" placeholder="Reason for reschedule" rows={3} />
                  <Button type="submit" variant="outline">Reschedule</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cancel</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={cancelAppointment} className="space-y-3">
                  <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
                  <Textarea name="adminNotes" placeholder="Cancellation reason" rows={3} />
                  <Button type="submit" variant="destructive">Cancel appointment</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={completeAppointment} className="space-y-3">
                  <input name="appointmentId" type="hidden" value={appointmentResult.data.id} />
                  <Textarea name="adminNotes" placeholder="Completion notes" rows={3} />
                  <Button type="submit" variant="primary">Complete appointment</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}
