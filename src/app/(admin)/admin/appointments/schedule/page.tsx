import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAppointmentSlot } from "@/features/appointments/actions/createAppointmentSlot";
import { listAdminAppointmentSlots } from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const slotsResult = await listAdminAppointmentSlots();

  return (
    <main className="space-y-5">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-background">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold text-foreground">Appointment schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage available slots with cleaner spacing and responsive table layout.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create slot</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAppointmentSlot} className="grid gap-3 md:grid-cols-4">
            <Input name="slotDate" required type="date" />
            <Input name="startTime" required type="time" />
            <Input name="endTime" required type="time" />
            <Input defaultValue={1} max={20} min={1} name="maxCapacity" required type="number" />
            <Button className="md:col-span-4 w-full sm:w-auto" type="submit" variant="accent">
              Create slot
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {!slotsResult.ok ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
              {slotsResult.message}
            </p>
          ) : slotsResult.data.length === 0 ? (
            <p className="rounded-lg border border-border bg-card-strong p-3 text-sm text-muted-foreground">
              No slots yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slotsResult.data.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.slotDate}</TableCell>
                    <TableCell>
                      {slot.startTime}-{slot.endTime}
                    </TableCell>
                    <TableCell>
                      {slot.bookedCount}/{slot.maxCapacity}
                    </TableCell>
                    <TableCell>{slot.isActive ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
